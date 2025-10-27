using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;
using Demo01.Infrastructure.Entities;
using Demo01.Shared.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Demo01.WebApi.Controllers
{
    public class HolidayController : Controller
    {
        private readonly IPlanningUnitOfWork _unitOfWork;
        private readonly IGoogleHolidayService _googleHolidayService;
        private readonly ILogger<HolidayController> _logger;

        public HolidayController(
            IPlanningUnitOfWork unitOfWork,
            IGoogleHolidayService googleHolidayService,
            ILogger<HolidayController> logger)
        {
            _unitOfWork = unitOfWork;
            _googleHolidayService = googleHolidayService;
            _logger = logger;
        }

        // GET: /Holiday?year=2025
        public IActionResult Index(int? year)
        {
            year ??= DateTime.UtcNow.Year;

            var holidays = _unitOfWork.Holidays
                .Where(h => h.Date.Year == year);

            ViewBag.Year = year;
            return View(holidays.OrderBy(h => h.Date));
        }

        // POST: /Holiday/Add
        [HttpPost]
        public async Task<IActionResult> Add(DateTimeOffset date, string? description)
        {
            var existing = await _unitOfWork.Holidays
                .Where(h => h.Date.Date == date.Date)
                .FirstOrDefaultAsync();

            if (existing == null)
            {
                var holiday = new Holiday
                {
                    Id = Guid.NewGuid(),
                    Date = date,
                    Description = description
                };

                await _unitOfWork.Holidays.AddAsync(holiday);
                await _unitOfWork.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Index), new { year = date.Year });
        }

        // POST: /Holiday/Delete/{id}
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id, int year)
        {
            await _unitOfWork.Holidays.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return RedirectToAction(nameof(Index), new { year });
        }

        // GET: /Holiday/ImportFromGoogle?year=2025
        public async Task<IActionResult> ImportFromGoogle(int year)
        {
            try
            {
                var response = await _googleHolidayService.GetVietnamHolidaysAsync(year);
                if (response?.Items == null || response.Items.Count == 0)
                {
                    TempData["Error"] = "Không tìm thấy dữ liệu ngày nghỉ từ Google Calendar.";
                    return RedirectToAction(nameof(Index), new { year });
                }

                var existingDates = (_unitOfWork.Holidays
                    .Where(h => h.Date.Year == year))
                    .Select(h => h.Date.Date)
                    .ToHashSet();

                var newHolidays = new List<Holiday>();

                foreach (var item in response.Items)
                {
                    DateTimeOffset date;

                    // 🎌 Nếu có trường dateTime (event có giờ cụ thể)
                    if (!string.IsNullOrWhiteSpace(item.Start.DateTime))
                    {
                        if (DateTimeOffset.TryParse(item.Start.DateTime, out var parsed))
                            date = parsed;
                        else
                            continue;
                    }
                    // 🎌 Nếu chỉ có date (ngày nghỉ cả ngày) → ép UTC+7 cho Việt Nam
                    else if (!string.IsNullOrWhiteSpace(item.Start.Date))
                    {
                        if (DateTime.TryParse(item.Start.Date, out var parsed))
                            date = new DateTimeOffset(parsed, TimeSpan.FromHours(7));
                        else
                            continue;
                    }
                    else continue;

                    if (existingDates.Contains(date.Date))
                        continue;

                    newHolidays.Add(new Holiday
                    {
                        Id = Guid.NewGuid(),
                        Date = date,
                        Description = item.Summary
                    });
                }

                if (newHolidays.Any())
                {
                    await _unitOfWork.Holidays.AddRangeAsync(newHolidays);
                    await _unitOfWork.SaveChangesAsync();
                }

                TempData["Message"] = $"Đã import {newHolidays.Count} ngày nghỉ từ Google Calendar.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing holidays from Google Calendar.");
                TempData["Error"] = "Đã xảy ra lỗi khi lấy dữ liệu từ Google Calendar.";
            }

            return RedirectToAction(nameof(Index), new { year });
        }
    }
}
