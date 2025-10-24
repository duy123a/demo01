using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;
using Demo01.Infrastructure.Entities;
using Demo01.WebApi.ViewModels.ForecastPlanningViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Demo01.WebApi.Controllers
{
    [Authorize]
    public class ForecastPlanningController : Controller
    {
        private readonly IPlanningUnitOfWork _uow;

        public ForecastPlanningController(IPlanningUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet]
        public async Task<IActionResult> Index(Guid? forecastId, Guid? weekId, int? departmentId)
        {
            var vm = new ForecastPlanningViewModel();

            // --- Forecast dropdown ---
            vm.Forecasts = await _uow.Forecasts
                .GetAll()
                .OrderByDescending(f => f.Year)
                .ThenByDescending(f => f.Month)
                .Select(f => new ForecastDropdownItem
                {
                    ForecastId = f.ForecastId,
                    DisplayName = $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(f.Month)} {f.Year}"
                })
                .ToListAsync();

            if (forecastId == null && vm.Forecasts.Any())
                forecastId = vm.Forecasts.First().ForecastId;

            vm.SelectedForecastId = forecastId;

            // --- Weeks dropdown ---
            if (!forecastId.HasValue) return View(vm);

            vm.Weeks = await _uow.ForecastWeeks
                .GetAll()
                .Where(w => w.ForecastId == forecastId.Value)
                .OrderBy(w => w.WeekNumber)
                .Select(w => new ForecastWeekDropdownItem
                {
                    ForecastWeekId = w.ForecastWeekId,
                    DisplayName = $"Week {w.WeekNumber:D2} ({w.StartDate:dd/MM} - {w.EndDate:dd/MM})"
                })
                .ToListAsync();

            if (weekId == null && vm.Weeks.Any())
                weekId = vm.Weeks.First().ForecastWeekId;

            vm.SelectedWeekId = weekId;

            // --- Department dropdown ---
            vm.Departments = await _uow.Departments
                .GetAll()
                .Select(d => new DepartmentDropdownItem
                {
                    DepartmentId = d.Id,
                    Name = d.Name
                })
                .ToListAsync();

            if (departmentId == null && vm.Departments.Any())
                departmentId = vm.Departments.First().DepartmentId;

            vm.SelectedDepartmentId = departmentId;

            // --- Load week info ---
            if (!vm.SelectedWeekId.HasValue || !vm.SelectedDepartmentId.HasValue)
                return View(vm);

            var week = await _uow.ForecastWeeks
                .GetAll()
                .Where(w => w.ForecastWeekId == vm.SelectedWeekId.Value)
                .FirstOrDefaultAsync();

            if (week == null)
                return View(vm);

            vm.SelectedWeek = week;
            vm.TargetLf = week.TotalLf;

            // --- Build working days ---
            var days = Enumerable.Range(0, (week.EndDate - week.StartDate).Days + 1)
                .Select(i => week.StartDate.AddDays(i))
                .Where(d => d.DayOfWeek != DayOfWeek.Sunday)
                .ToList();

            vm.DatesInWeek = days;

            vm.HolidayList = await _uow.Holidays
                .GetAll()
                .Where(h => h.Date >= week.StartDate.Date
                         && h.Date <= week.EndDate.Date)
                .Select(h => h.Date)
                .ToListAsync();

            // --- Get or create ForecastPlanning ---
            var planning = await _uow.ForecastPlannings
                .GetAll()
                .Include(p => p.ForecastPlanningDates)
                .ThenInclude(d => d.ForecastPlanningProcesses)
                .FirstOrDefaultAsync(p =>
                    p.ForecastWeekId == week.ForecastWeekId &&
                    p.DepartmentId == departmentId);

            if (planning == null)
            {
                planning = new ForecastPlanning
                {
                    Id = Guid.NewGuid(),
                    ForecastWeekId = week.ForecastWeekId,
                    DepartmentId = departmentId!.Value,
                    CreatedAt = DateTimeOffset.Now
                };
                await _uow.ForecastPlannings.AddAsync(planning);
                await _uow.SaveChangesAsync();
            }

            vm.HasSaturday = planning.HasSaturday;

            // --- Load all processes ---
            var processes = await _uow.Processes.GetAll().ToListAsync();
            vm.AllProcesses = processes;

            // --- Create ForecastPlanningDate + ForecastPlanningProcess if missing ---
            foreach (var day in days)
            {
                var planningDate = planning.ForecastPlanningDates
                    .FirstOrDefault(x => x.PlanningDate.Date == day.Date);

                if (planningDate == null)
                {
                    planningDate = new ForecastPlanningDate
                    {
                        Id = Guid.NewGuid(),
                        PlanningDate = day.Date,
                        ForecastPlanningId = planning.Id,
                        CreatedAt = DateTimeOffset.Now
                    };
                    await _uow.ForecastPlanningDates.AddAsync(planningDate);
                    planning.ForecastPlanningDates.Add(planningDate);
                }

                foreach (var process in processes)
                {
                    if (!planningDate.ForecastPlanningProcesses.Any(p => p.ProcessId == process.Id))
                    {
                        decimal defaultHour = day.DayOfWeek switch
                        {
                            DayOfWeek.Monday => 11,
                            DayOfWeek.Tuesday => 9,
                            DayOfWeek.Wednesday => 11,
                            DayOfWeek.Thursday => 9,
                            DayOfWeek.Friday => 11,
                            DayOfWeek.Saturday => 8,
                            _ => 0
                        };

                        var newProc = new ForecastPlanningProcess
                        {
                            Id = Guid.NewGuid(),
                            ForecastPlanningDateId = planningDate.Id,
                            ProcessId = process.Id,
                            WorkingHour = defaultHour,
                            ActualLf = 0,
                            TargetLf = 0,
                            CreatedAt = DateTimeOffset.Now
                        };

                        await _uow.ForecastPlanningProcesses.AddAsync(newProc);
                        planningDate.ForecastPlanningProcesses.Add(newProc);
                    }
                }
            }

            await _uow.SaveChangesAsync();

            vm.PlanningProcesses = planning.ForecastPlanningDates
                .SelectMany(d => d.ForecastPlanningProcesses)
                .ToList();

            vm.TotalHours = await CalculateTotalHourAsync(vm.SelectedWeekId!.Value, departmentId!.Value);
            await DistributeTargetLfAsync(vm.SelectedWeekId!.Value, departmentId!.Value);

            return View(vm);
        }

        // ----------------------------- Update Working Hour -----------------------------
        [HttpPost]
        public async Task<IActionResult> UpdateWorkingHour([FromBody] UpdateWorkingHourDto dto)
        {
            if (!DateTime.TryParseExact(dto.Date, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
                return BadRequest("Invalid date format");

            var dateOnly = parsedDate.Date;

            var planning = await _uow.ForecastPlannings
                .GetAll()
                .FirstOrDefaultAsync(p => p.ForecastWeekId == dto.ForecastWeekId && p.DepartmentId == dto.DepartmentId);

            if (planning == null)
            {
                planning = new ForecastPlanning
                {
                    Id = Guid.NewGuid(),
                    ForecastWeekId = dto.ForecastWeekId,
                    DepartmentId = dto.DepartmentId,
                    CreatedAt = DateTimeOffset.Now
                };
                await _uow.ForecastPlannings.AddAsync(planning);
                await _uow.SaveChangesAsync();
            }

            var planningDate = await _uow.ForecastPlanningDates
                .GetAll()
                .FirstOrDefaultAsync(d => d.ForecastPlanningId == planning.Id && d.PlanningDate.Date == dateOnly);

            if (planningDate == null)
            {
                planningDate = new ForecastPlanningDate
                {
                    Id = Guid.NewGuid(),
                    ForecastPlanningId = planning.Id,
                    PlanningDate = dateOnly,
                    CreatedAt = DateTimeOffset.Now
                };
                await _uow.ForecastPlanningDates.AddAsync(planningDate);
                await _uow.SaveChangesAsync();
            }

            var record = await _uow.ForecastPlanningProcesses
                .GetAll()
                .FirstOrDefaultAsync(p => p.ForecastPlanningDateId == planningDate.Id && p.ProcessId == dto.ProcessId);

            if (record == null)
            {
                record = new ForecastPlanningProcess
                {
                    Id = Guid.NewGuid(),
                    ForecastPlanningDateId = planningDate.Id,
                    ProcessId = dto.ProcessId,
                    WorkingHour = dto.WorkingHour,
                    ActualLf = 0,
                    TargetLf = 0
                };
                await _uow.ForecastPlanningProcesses.AddAsync(record);
            }
            else
            {
                record.WorkingHour = dto.WorkingHour;
                record.UpdatedAt = DateTimeOffset.Now;
            }

            await _uow.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> UpdateWorkingHourList([FromBody] List<UpdateWorkingHourDto> dtos)
        {
            if (dtos == null || !dtos.Any())
                return BadRequest("Empty list");

            // Group theo tuần và phòng ban để xử lý batch
            var grouped = dtos
                .GroupBy(x => new { x.ForecastWeekId, x.DepartmentId })
                .ToList();

            foreach (var group in grouped)
            {
                var weekId = group.Key.ForecastWeekId;
                var departmentId = group.Key.DepartmentId;

                // Load planning (nếu chưa có thì tạo mới)
                var planning = await _uow.ForecastPlannings
                    .GetAll()
                    .FirstOrDefaultAsync(p => p.ForecastWeekId == weekId && p.DepartmentId == departmentId);

                if (planning == null)
                {
                    planning = new ForecastPlanning
                    {
                        Id = Guid.NewGuid(),
                        ForecastWeekId = weekId,
                        DepartmentId = departmentId,
                        CreatedAt = DateTimeOffset.Now
                    };
                    await _uow.ForecastPlannings.AddAsync(planning);
                    await _uow.SaveChangesAsync();
                }

                // Lấy tất cả ngày trong batch
                var dates = group
                    .Select(x => DateTime.ParseExact(x.Date, "yyyyMMdd", CultureInfo.InvariantCulture))
                    .Distinct()
                    .ToList();

                // Load trước tất cả ForecastPlanningDate liên quan
                var existingDates = await _uow.ForecastPlanningDates
                    .GetAll()
                    .Where(d => d.ForecastPlanningId == planning.Id && dates.Contains(d.PlanningDate.Date))
                    .ToListAsync();

                foreach (var dto in group)
                {
                    if (!DateTime.TryParseExact(dto.Date, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
                        continue;

                    var dateOnly = parsedDate.Date;
                    var planningDate = existingDates.FirstOrDefault(d => d.PlanningDate.Date == dateOnly);

                    if (planningDate == null)
                    {
                        planningDate = new ForecastPlanningDate
                        {
                            Id = Guid.NewGuid(),
                            ForecastPlanningId = planning.Id,
                            PlanningDate = dateOnly,
                            CreatedAt = DateTimeOffset.Now
                        };
                        await _uow.ForecastPlanningDates.AddAsync(planningDate);
                        existingDates.Add(planningDate);
                    }

                    // Load or create process record
                    var record = await _uow.ForecastPlanningProcesses
                        .GetAll()
                        .FirstOrDefaultAsync(p => p.ForecastPlanningDateId == planningDate.Id && p.ProcessId == dto.ProcessId);

                    if (record == null)
                    {
                        record = new ForecastPlanningProcess
                        {
                            Id = Guid.NewGuid(),
                            ForecastPlanningDateId = planningDate.Id,
                            ProcessId = dto.ProcessId,
                            WorkingHour = dto.WorkingHour,
                            ActualLf = 0,
                            TargetLf = 0
                        };
                        await _uow.ForecastPlanningProcesses.AddAsync(record);
                    }
                    else
                    {
                        record.WorkingHour = dto.WorkingHour;
                        record.UpdatedAt = DateTimeOffset.Now;
                    }
                }
            }

            await _uow.SaveChangesAsync();
            return Ok();
        }

        // ----------------------------- Save Actual LF -----------------------------
        [HttpPost]
        public async Task<IActionResult> SaveActualLf([FromBody] List<UpdateActualLfDto> items)
        {
            foreach (var dto in items)
            {
                if (!DateTime.TryParseExact(dto.Date, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
                    continue;

                var dateOnly = parsedDate.Date;

                var planning = await _uow.ForecastPlannings
                    .GetAll()
                    .FirstOrDefaultAsync(p => p.ForecastWeekId == dto.ForecastWeekId && p.DepartmentId == dto.DepartmentId);

                if (planning == null)
                {
                    planning = new ForecastPlanning
                    {
                        Id = Guid.NewGuid(),
                        ForecastWeekId = dto.ForecastWeekId,
                        DepartmentId = dto.DepartmentId,
                        CreatedAt = DateTimeOffset.Now
                    };
                    await _uow.ForecastPlannings.AddAsync(planning);
                    await _uow.SaveChangesAsync();
                }

                var planningDate = await _uow.ForecastPlanningDates
                    .GetAll()
                    .FirstOrDefaultAsync(d => d.ForecastPlanningId == planning.Id && d.PlanningDate.Date == dateOnly);

                if (planningDate == null)
                {
                    planningDate = new ForecastPlanningDate
                    {
                        Id = Guid.NewGuid(),
                        ForecastPlanningId = planning.Id,
                        PlanningDate = dateOnly,
                        CreatedAt = DateTimeOffset.Now
                    };
                    await _uow.ForecastPlanningDates.AddAsync(planningDate);
                    await _uow.SaveChangesAsync();
                }

                var process = await _uow.ForecastPlanningProcesses
                    .GetAll()
                    .FirstOrDefaultAsync(p => p.ForecastPlanningDateId == planningDate.Id && p.ProcessId == dto.ProcessId);

                if (process == null)
                {
                    process = new ForecastPlanningProcess
                    {
                        Id = Guid.NewGuid(),
                        ForecastPlanningDateId = planningDate.Id,
                        ProcessId = dto.ProcessId,
                        WorkingHour = 0,
                        ActualLf = dto.ActualLf,
                        TargetLf = 0
                    };
                    await _uow.ForecastPlanningProcesses.AddAsync(process);
                }
                else
                {
                    process.ActualLf = dto.ActualLf;
                    process.UpdatedAt = DateTimeOffset.Now;
                }
            }

            await _uow.SaveChangesAsync();
            return Ok();
        }

        // ----------------------------- Distribute Target LF -----------------------------
        private async Task DistributeTargetLfAsync(Guid weekId, int departmentId)
        {
            // Load target week and related planning for that department
            var week = await _uow.ForecastWeeks
                .GetAll()
                .FirstOrDefaultAsync(w => w.ForecastWeekId == weekId);

            if (week == null || week.TotalLf <= 0)
                return;

            var planning = await _uow.ForecastPlannings
                .GetAll()
                .Include(p => p.ForecastPlanningDates)
                    .ThenInclude(d => d.ForecastPlanningProcesses)
                .FirstOrDefaultAsync(p => p.ForecastWeekId == weekId && p.DepartmentId == departmentId);

            if (planning == null)
                return;

            var totalHoursByProcess = await CalculateTotalHourAsync(weekId, departmentId);
            if (!totalHoursByProcess.Any())
                return;

            var holidays = await _uow.Holidays.GetAll().Select(h => h.Date).ToListAsync();

            foreach (var date in planning.ForecastPlanningDates)
            {
                if (!planning.HasSaturday && date.PlanningDate.DayOfWeek == DayOfWeek.Saturday)
                    continue;
                if (holidays.Contains(date.PlanningDate))
                    continue;

                foreach (var proc in date.ForecastPlanningProcesses)
                {
                    if (!totalHoursByProcess.TryGetValue(proc.ProcessId, out var totalHour) || totalHour == 0)
                        continue;

                    var target = (week.TotalLf / totalHour) * proc.WorkingHour;
                    proc.TargetLf = Math.Round(target, 2);
                }

                // Optional normalization
                var minTarget = date.ForecastPlanningProcesses.Min(p => p.TargetLf);
                foreach (var proc in date.ForecastPlanningProcesses)
                {
                    proc.TargetLf = minTarget;
                }
            }

            await _uow.SaveChangesAsync();
        }

        // ----------------------------- Calculate Total Hours -----------------------------
        private async Task<Dictionary<int, decimal>> CalculateTotalHourAsync(Guid weekId, int departmentId)
        {
            var week = await _uow.ForecastWeeks
                .GetAll()
                .FirstOrDefaultAsync(w => w.ForecastWeekId == weekId);

            if (week == null)
                return new Dictionary<int, decimal>();

            var planning = await _uow.ForecastPlannings
                .GetAll()
                .AsNoTrackingWithIdentityResolution()
                .Include(p => p.ForecastPlanningDates)
                    .ThenInclude(d => d.ForecastPlanningProcesses)
                .FirstOrDefaultAsync(p => p.ForecastWeekId == weekId && p.DepartmentId == departmentId);

            if (planning == null)
                return new Dictionary<int, decimal>();

            var holidays = await _uow.Holidays.GetAll().Select(h => h.Date).ToListAsync();

            var validDates = planning.ForecastPlanningDates
                .Where(d => (planning.HasSaturday || d.PlanningDate.DayOfWeek != DayOfWeek.Saturday)
                            && !holidays.Contains(d.PlanningDate))
                .ToList();

            var totalHoursByProcess = validDates
                .SelectMany(d => d.ForecastPlanningProcesses)
                .GroupBy(p => p.ProcessId)
                .ToDictionary(
                    g => g.Key,
                    g => g.Sum(x => x.WorkingHour)
                );

            return totalHoursByProcess;
        }

        // ----------------------------- Update Has Saturday -----------------------------
        [HttpPost]
        public async Task<IActionResult> UpdateHasSaturday([FromBody] UpdateHasSaturdayDto dto)
        {
            // Lấy ForecastPlanning theo tuần + phòng ban
            var planning = await _uow.ForecastPlannings
                .GetAll()
                .FirstOrDefaultAsync(p =>
                    p.ForecastWeekId == dto.ForecastWeekId &&
                    p.DepartmentId == dto.DepartmentId);

            if (planning == null)
                return NotFound("Forecast planning not found for the specified week and department.");

            // Cập nhật HasSaturday trong ForecastPlanning
            planning.HasSaturday = dto.HasSaturday;
            planning.UpdatedAt = DateTimeOffset.Now;

            await _uow.SaveChangesAsync();

            // Cập nhật lại Target LF theo thay đổi mới
            await DistributeTargetLfAsync(dto.ForecastWeekId, dto.DepartmentId);

            return Ok(new
            {
                message = $"Updated HasSaturday = {dto.HasSaturday} for department {dto.DepartmentId} in week {dto.ForecastWeekId}"
            });
        }
    }

    // DTOs
    public class UpdateWorkingHourDto
    {
        public Guid ForecastId { get; set; }
        public Guid ForecastWeekId { get; set; }
        public int DepartmentId { get; set; }
        public int ProcessId { get; set; }
        public string Date { get; set; } = string.Empty; // yyyyMMdd
        public decimal WorkingHour { get; set; }
    }

    public class UpdateHasSaturdayDto
    {
        public Guid ForecastWeekId { get; set; }
        public bool HasSaturday { get; set; }
        public int DepartmentId { get; set; }
    }

    public class UpdateActualLfDto
    {
        public Guid ForecastId { get; set; }
        public Guid ForecastWeekId { get; set; }
        public int DepartmentId { get; set; }
        public int ProcessId { get; set; }
        public string Date { get; set; } = string.Empty; // yyyyMMdd
        public decimal ActualLf { get; set; }
    }
}
