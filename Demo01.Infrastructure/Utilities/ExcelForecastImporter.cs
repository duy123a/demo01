using ClosedXML.Excel;
using Demo01.Infrastructure.Data.Context;
using Demo01.Infrastructure.Entities;
using Demo01.Infrastructure.Enums;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Demo01.Infrastructure.Utilities
{
    public class ExcelForecastImporter
    {
        private readonly AppDbContext _db;

        public ExcelForecastImporter(AppDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Import toàn bộ workbook. Nếu sheetNamePattern null => đọc tất cả sheet.
        /// </summary>
        public async Task<ImportResult> ImportFromFileAsync(string filePath, CancellationToken ct = default)
        {
            var result = new ImportResult();
            using var workbook = new XLWorkbook(filePath);
            using var tx = await _db.Database.BeginTransactionAsync(ct);

            try
            {
                // Xử lý từng sheet
                foreach (var worksheet in workbook.Worksheets)
                {
                    var sheetName = worksheet.Name.Trim();
                    // match pattern like w49-2024 or W49-2024
                    var (ok, week, year) = ParseSheetName(sheetName);
                    if (!ok)
                    {
                        result.SkippedSheets.Add(sheetName);
                        continue;
                    }

                    result.ProcessedSheets.Add(sheetName);

                    // Compute month by taking Monday of that week and reading its month
                    var monday = ForecastWeekCalculator.GetMondayOfIsoWeek(year, week);
                    int month = monday.Month; // month for the Forecast

                    // Get or create Forecast (year + month)
                    var forecast = await GetOrCreateForecastAsync(year, (byte)month, ct);

                    // Ensure ForecastWeek exists for this week under the forecast (week is independent of forecast's month,
                    // but we still create ForecastWeek linking to Forecast)
                    var fw = await GetOrCreateForecastWeekAsync(forecast, year, (byte)week, ct);

                    // Read rows: assume header on row 1. Data from row 2..lastUsedRow
                    var firstRow = worksheet.FirstRowUsed()!.RowNumber();
                    var lastRow = worksheet.LastRowUsed()!.RowNumber();

                    var startRow = firstRow; // if header exists at row1, we skip it
                    // heuristics: if first row contains text like "No" then skip it
                    var firstRowValues = worksheet.Row(firstRow).CellsUsed().Select(c => c.GetString()).ToArray();
                    if (firstRowValues.Any(s => s != null && s.Trim().Length > 0 && s.All(char.IsLetter))) startRow = firstRow + 1;
                    // safer: just start at row 2
                    if (firstRow == 1) startRow = 2;

                    for (int r = startRow; r <= lastRow; r++)
                    {
                        if (ct.IsCancellationRequested) break;
                        var row = worksheet.Row(r);

                        // Columns are 1-based:
                        // col 2 (B) = SerieNumber
                        // col 3 (C) = "Model Size Colour"
                        // col 4 (D) = SapOrder
                        // col 7 (G) = LF

                        var serie = row.Cell(2).GetString().Trim();
                        var modelCell = row.Cell(3).GetString().Trim();
                        var sapOrder = row.Cell(4).GetString().Trim();
                        var lfCell = row.Cell(7).GetString().Trim();

                        if (string.IsNullOrWhiteSpace(serie) && string.IsNullOrWhiteSpace(modelCell) && string.IsNullOrWhiteSpace(sapOrder))
                        {
                            result.EmptyRows++;
                            continue;
                        }

                        // normalize serie
                        serie = serie ?? string.Empty;

                        // parse LF
                        decimal lf = 0;
                        if (!string.IsNullOrWhiteSpace(lfCell))
                        {
                            if (!decimal.TryParse(lfCell.Replace(',', '.'), NumberStyles.Any, CultureInfo.InvariantCulture, out lf))
                            {
                                // try numeric cell
                                var cell = row.Cell(7);
                                if (cell.DataType == XLDataType.Number)
                                    lf = (decimal)cell.GetDouble();
                            }
                        }

                        // parse model string: take first 3 tokens, drop extras (e.g. Solo)
                        var (modelName, size, colour) = ParseModelSizeColour(modelCell);

                        // CREATE/GET model
                        var model = await GetOrCreateModelAsync(modelName, ct);

                        // CREATE/GET variant
                        var variant = await GetOrCreateVariantAsync(model, size, colour, lf, ct);

                        // CREATE/GET Order by sapOrder (if empty, we create a placeholder order)
                        Order order = null!;
                        if (!string.IsNullOrWhiteSpace(sapOrder))
                            order = await GetOrCreateOrderAsync(sapOrder, ct);
                        else
                            order = await GetOrCreateOrderAsync($"NO-SAP-{Guid.NewGuid()}", ct); // fallback

                        // CREATE ForecastItem if not exists (serie unique)
                        var existingItem = await _db.ForecastItems
                            .AsNoTracking()
                            .FirstOrDefaultAsync(fi => fi.SerieNumber == serie, cancellationToken: ct);

                        if (existingItem != null)
                        {
                            result.DuplicateSeries++;
                            continue; // skip duplicate
                        }

                        var newItem = new ForecastItem
                        {
                            ForecastItemId = Guid.NewGuid(),
                            ForecastWeekId = fw.ForecastWeekId,
                            OrderId = order.OrderId,
                            SerieNumber = serie,
                            VariantId = variant.VariantId,
                            Status = ForecastItemStatus.None,
                            ShippingWeek = string.Empty,
                            CreatedAt = DateTimeOffset.UtcNow,
                            UpdatedAt = DateTimeOffset.UtcNow
                        };

                        _db.ForecastItems.Add(newItem);
                        result.InsertedItems++;
                    } // end rows

                    // commit after sheet
                    await _db.SaveChangesAsync(ct);
                } // end sheets

                await tx.CommitAsync(ct);
                result.Success = true;
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync(ct);
                result.Success = false;
                result.Error = ex.ToString();
            }

            return result;
        }

        #region helpers - get or create

        private static (bool ok, int week, int year) ParseSheetName(string name)
        {
            // accept formats: w49-2024, W49_2024, 49-2024, wk49-2024
            var lowered = name.ToLower().Replace("wk", "w").Replace("_", "-").Trim();
            var parts = lowered.Split('-', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length >= 2)
            {
                var p0 = parts[0].Trim();
                if (p0.StartsWith("w")) p0 = p0.Substring(1);
                if (int.TryParse(p0, out var week) && int.TryParse(parts[1], out var year))
                    return (true, week, year);
            }
            return (false, 0, 0);
        }

        private async Task<Forecast> GetOrCreateForecastAsync(int year, byte month, CancellationToken ct)
        {
            var f = await _db.Forecasts.FirstOrDefaultAsync(x => x.Year == year && x.Month == month, ct);
            if (f != null) return f;

            f = new Forecast
            {
                ForecastId = Guid.NewGuid(),
                Year = year,
                Month = month,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };
            _db.Forecasts.Add(f);
            await _db.SaveChangesAsync(ct);
            return f;
        }

        private async Task<ForecastWeek> GetOrCreateForecastWeekAsync(Forecast forecast, int year, byte week, CancellationToken ct)
        {
            var existing = await _db.ForecastWeeks
                .FirstOrDefaultAsync(w => w.ForecastId == forecast.ForecastId && w.WeekNumber == week, ct);

            if (existing != null) return existing;

            var (start, end) = ForecastWeekCalculator.CalculateWeekRange(year, week);

            var fw = new ForecastWeek
            {
                ForecastWeekId = Guid.NewGuid(),
                ForecastId = forecast.ForecastId,
                WeekNumber = week,
                StartDate = start,
                EndDate = end,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };
            _db.ForecastWeeks.Add(fw);
            await _db.SaveChangesAsync(ct);
            return fw;
        }

        private async Task<Model> GetOrCreateModelAsync(string modelName, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(modelName)) modelName = "UNKNOWN";

            var m = await _db.Models.FirstOrDefaultAsync(x => x.ModelName == modelName, ct);
            if (m != null) return m;

            m = new Model
            {
                ModelId = Guid.NewGuid(),
                ModelName = modelName,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };
            _db.Models.Add(m);
            await _db.SaveChangesAsync(ct);
            return m;
        }

        private async Task<ModelVariant> GetOrCreateVariantAsync(Model model, string size, string colour, decimal lf, CancellationToken ct)
        {
            size ??= string.Empty;
            colour ??= string.Empty;

            var v = await _db.ModelVariants
                .FirstOrDefaultAsync(x => x.ModelId == model.ModelId && x.Size == size && x.Colour == colour, ct);

            if (v != null) return v;

            v = new ModelVariant
            {
                VariantId = Guid.NewGuid(),
                ModelId = model.ModelId,
                Size = size,
                Colour = colour,
                LF = lf,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };
            _db.ModelVariants.Add(v);
            await _db.SaveChangesAsync(ct);
            return v;
        }

        private async Task<Order> GetOrCreateOrderAsync(string sapOrder, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(sapOrder)) sapOrder = $"NO-SAP-{Guid.NewGuid()}";

            var o = await _db.Orders.FirstOrDefaultAsync(x => x.SapOrderNumber == sapOrder, ct);
            if (o != null) return o;

            o = new Order
            {
                OrderId = Guid.NewGuid(),
                SapOrderNumber = sapOrder,
                Status = OrderStatus.None,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };
            _db.Orders.Add(o);
            await _db.SaveChangesAsync(ct);
            return o;
        }

        #endregion

        private static (string model, string size, string colour) ParseModelSizeColour(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return (string.Empty, string.Empty, string.Empty);

            // Normalize: collapse multiple spaces, trim
            var tokens = input.Trim().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).ToList();

            // remove trailing tokens like "Solo" or "RP" if any common words - but per rule: take first 3 tokens
            if (tokens.Count >= 3)
            {
                return (tokens[0], tokens[1], tokens[2]);
            }
            if (tokens.Count == 2) return (tokens[0], tokens[1], string.Empty);
            return (tokens[0], string.Empty, string.Empty);
        }
    }

    public class ImportResult
    {
        public bool Success { get; set; } = false;
        public List<string> ProcessedSheets { get; set; } = new();
        public List<string> SkippedSheets { get; set; } = new();
        public int InsertedItems { get; set; } = 0;
        public int DuplicateSeries { get; set; } = 0;
        public int EmptyRows { get; set; } = 0;
        public string? Error { get; set; }
    }
}
