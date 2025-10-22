using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;
using Demo01.Infrastructure.Entities;
using Demo01.WebApi.ViewModels;
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
            if (forecastId.HasValue)
            {
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
            }

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

            // --- Load ForecastWeek info ---
            if (vm.SelectedWeekId.HasValue)
            {
                var week = await _uow.ForecastWeeks
                    .GetAll()
                    .Where(w => w.ForecastWeekId == vm.SelectedWeekId.Value)
                    .FirstOrDefaultAsync();

                if (week != null)
                {
                    vm.SelectedWeek = week;
                    vm.TargetLf = week.TotalLf;
                    vm.HasSaturday = week.HasSaturday;
                    vm.DatesInWeek = Enumerable.Range(0, (week.EndDate - week.StartDate).Days)
                        .Select(i => week.StartDate.AddDays(i))
                        .Where(d => d.DayOfWeek != DayOfWeek.Sunday)
                        .ToList();
                    vm.HolidayList = await _uow.Holidays
                        .GetAll()
                        .Where(h => h.Date >= DateOnly.FromDateTime(week.StartDate.DateTime)
                                 && h.Date <= DateOnly.FromDateTime(week.EndDate.DateTime))
                        .Select(h => h.Date)
                        .ToListAsync();
                }
            }

            // --- Load Processes (BOTTOM, TOP, FINAL, ...) ---
            var processes = await _uow.Processes.GetAll().ToListAsync();
            vm.AllProcesses = processes;

            // --- Load Planning data ---
            if (vm.SelectedWeekId.HasValue)
            {
                var start = vm.SelectedWeek.StartDate;
                var end = vm.SelectedWeek.EndDate;

                // tạo danh sách ngày
                var days = Enumerable.Range(0, (end - start).Days + 1)
                    .Select(i => start.AddDays(i))
                    .Where(d => d.DayOfWeek != DayOfWeek.Sunday)
                    .ToList();

                // lấy tất cả ForecastPlanning của tuần này
                var weekPlannings = await _uow.ForecastPlannings
                    .GetAll()
                    .Where(p => p.ForecastWeekId == vm.SelectedWeekId.Value)
                    .Include(p => p.ForecastWeek)
                    .ToListAsync();

                var existingProcesses = await _uow.ForecastPlanningProcesses
                    .GetAll()
                    .Include(fpp => fpp.ForecastPlanning)
                    .Where(p => p.ForecastPlanning.ForecastWeekId == vm.SelectedWeekId.Value)
                    .ToListAsync();

                foreach (var day in days)
                {
                    var planningDate = DateOnly.FromDateTime(day.DateTime);

                    // nếu chưa có ForecastPlanning cho ngày này thì tạo mới
                    var planning = weekPlannings.FirstOrDefault(x => x.PlanningDate == planningDate);
                    if (planning == null)
                    {
                        planning = new ForecastPlanning
                        {
                            Id = Guid.NewGuid(),
                            ForecastWeekId = vm.SelectedWeekId.Value,
                            PlanningDate = planningDate,
                            CreatedAt = DateTimeOffset.Now
                        };
                        await _uow.ForecastPlannings.AddAsync(planning);
                        weekPlannings.Add(planning);
                    }

                    foreach (var process in processes)
                    {
                        // nếu chưa có ForecastPlanningProcess cho process + ngày này thì tạo mới
                        var exist = existingProcesses.FirstOrDefault(x =>
                            x.ProcessId == process.Id && x.ForecastPlanningId == planning.Id);

                        if (exist == null)
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
                                ForecastPlanningId = planning.Id,
                                ProcessId = process.Id,
                                WorkingHour = defaultHour,
                                ActualLf = 0,
                                TargetLf = 0
                            };

                            await _uow.ForecastPlanningProcesses.AddAsync(newProc);
                            existingProcesses.Add(newProc);
                        }
                    }
                }

                await _uow.SaveChangesAsync(); // lưu các record mới tạo

                vm.TotalHours = await CalculateTotalHourAsync(vm.SelectedWeekId!.Value);
                vm.PlanningProcesses = existingProcesses;

                await DistributeTargetLfAsync(vm.SelectedWeekId!.Value);
            }

            return View(vm);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateWorkingHour([FromBody] UpdateWorkingHourDto dto)
        {
            // Parse date từ string yyyyMMdd → DateOnly
            if (!DateTime.TryParseExact(dto.Date, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
                return BadRequest("Invalid date format");

            var planningDate = DateOnly.FromDateTime(parsedDate);

            // Tìm ForecastPlanning tương ứng
            var planning = await _uow.ForecastPlannings
                .GetAll()
                .FirstOrDefaultAsync(p =>
                    p.ForecastWeekId == dto.ForecastWeekId &&
                    p.PlanningDate == planningDate);

            if (planning == null)
            {
                // Nếu chưa có thì tạo mới
                planning = new ForecastPlanning
                {
                    Id = Guid.NewGuid(),
                    ForecastWeekId = dto.ForecastWeekId,
                    PlanningDate = planningDate,
                    CreatedAt = DateTimeOffset.Now
                };
                await _uow.ForecastPlannings.AddAsync(planning);
                await _uow.SaveChangesAsync();
            }
            else
            {
                // Nếu có rồi thì chỉ update PlanningDate nếu cần (cho đồng bộ)
                planning.PlanningDate = planningDate;
            }

            // Tìm process tương ứng
            var process = await _uow.Processes
                .GetAll()
                .FirstOrDefaultAsync(x => x.Id == dto.ProcessId);

            if (process == null)
                return BadRequest("Invalid process");

            // Tìm record trong ForecastPlanningProcesses
            var record = await _uow.ForecastPlanningProcesses
                .GetAll()
                .FirstOrDefaultAsync(p =>
                    p.ForecastPlanningId == planning.Id &&
                    p.ProcessId == dto.ProcessId);

            if (record == null)
            {
                record = new ForecastPlanningProcess
                {
                    Id = Guid.NewGuid(),
                    ForecastPlanningId = planning.Id,
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
            }

            planning.UpdatedAt = DateTimeOffset.Now;
            await _uow.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> UpdateHasSaturday([FromBody] UpdateHasSaturdayDto dto)
        {
            var week = await _uow.ForecastWeeks.GetByIdAsync(dto.ForecastWeekId);
            if (week == null)
                return NotFound();

            week.HasSaturday = dto.HasSaturday;
            await _uow.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> SaveActualLf([FromBody] List<UpdateActualLfDto> items)
        {
            foreach (var dto in items)
            {
                if (!DateTime.TryParseExact(dto.Date, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
                    continue;

                var planningDate = DateOnly.FromDateTime(parsedDate);

                // Tìm ForecastPlanning
                var planning = await _uow.ForecastPlannings
                    .GetAll()
                    .FirstOrDefaultAsync(p =>
                        p.ForecastWeekId == dto.ForecastWeekId &&
                        p.PlanningDate == planningDate);

                if (planning == null)
                {
                    planning = new ForecastPlanning
                    {
                        Id = Guid.NewGuid(),
                        ForecastWeekId = dto.ForecastWeekId,
                        PlanningDate = planningDate,
                        CreatedAt = DateTimeOffset.Now
                    };
                    await _uow.ForecastPlannings.AddAsync(planning);
                    await _uow.SaveChangesAsync();
                }

                // Tìm process
                var record = await _uow.ForecastPlanningProcesses
                    .GetAll()
                    .FirstOrDefaultAsync(p =>
                        p.ForecastPlanningId == planning.Id &&
                        p.ProcessId == dto.ProcessId);

                if (record != null)
                {
                    record.ActualLf = dto.ActualLf;
                    record.UpdatedAt = DateTimeOffset.Now;
                }
                else
                {
                    var newProc = new ForecastPlanningProcess
                    {
                        Id = Guid.NewGuid(),
                        ForecastPlanningId = planning.Id,
                        ProcessId = dto.ProcessId,
                        WorkingHour = 0,
                        ActualLf = dto.ActualLf,
                        TargetLf = 0
                    };
                    await _uow.ForecastPlanningProcesses.AddAsync(newProc);
                }
            }

            await _uow.SaveChangesAsync();
            return Ok();
        }

        private async Task DistributeTargetLfAsync(Guid weekId)
        {
            // Lấy thông tin tuần và process
            var week = await _uow.ForecastWeeks
                .GetAll()
                .Include(w => w.ForecastPlannings)
                .FirstOrDefaultAsync(w => w.ForecastWeekId == weekId);

            if (week == null || week.TotalLf <= 0)
                return;

            // Tính tổng giờ (đã bỏ thứ 7 & holiday)
            var totalHoursByProcess = await CalculateTotalHourAsync(weekId);
            if (!totalHoursByProcess.Any())
                return;

            // Lấy toàn bộ process thuộc tuần
            var processes = await _uow.ForecastPlanningProcesses
                .GetAll()
                .Include(p => p.ForecastPlanning)
                .Where(p => p.ForecastPlanning.ForecastWeek.ForecastWeekId == weekId)
                .ToListAsync();

            // Lấy holiday
            var holidays = await _uow.Holidays
                .GetAll()
                .Select(h => h.Date)
                .ToListAsync();

            // Lọc bỏ thứ 7 và ngày nghỉ
            if (!week.HasSaturday)
            {
                processes = processes
                    .Where(p => p.ForecastPlanning.PlanningDate.DayOfWeek != DayOfWeek.Saturday)
                    .ToList();
            }

            processes = processes
                .Where(p => !holidays.Contains(p.ForecastPlanning.PlanningDate))
                .ToList();

            // Duyệt từng ngày để chia target
            var days = processes
                .Select(p => p.ForecastPlanning.PlanningDate)
                .Distinct()
                .OrderBy(d => d)
                .ToList();

            foreach (var day in days)
            {
                var dayProcesses = processes
                    .Where(p => p.ForecastPlanning.PlanningDate == day)
                    .ToList();

                if (!dayProcesses.Any())
                    continue;

                // Tính target dựa trên working hour
                foreach (var proc in dayProcesses)
                {
                    if (!totalHoursByProcess.TryGetValue(proc.ProcessId, out var totalHour) || totalHour == 0)
                        continue;

                    var target = (week.TotalLf / totalHour) * proc.WorkingHour;
                    proc.TargetLf = Math.Round(target, 2);
                }

                // Cập nhật theo giá trị nhỏ nhất trong ngày (nếu cần đồng bộ)
                var minTarget = dayProcesses.Min(p => p.TargetLf);
                foreach (var proc in dayProcesses)
                {
                    proc.TargetLf = minTarget;
                }
            }

            await _uow.SaveChangesAsync();
        }

        private async Task<Dictionary<int, decimal>> CalculateTotalHourAsync(Guid weekId)
        {
            var week = await _uow.ForecastWeeks
                .GetAll()
                .FirstOrDefaultAsync(w => w.ForecastWeekId == weekId);

            if (week == null)
                return new Dictionary<int, decimal>();

            // Lấy toàn bộ ForecastPlanningProcess của tuần này
            var list = await _uow.ForecastPlanningProcesses
                .GetAll()
                .Include(p => p.ForecastPlanning)
                .Where(p => p.ForecastPlanning.ForecastWeek.ForecastWeekId == weekId)
                .ToListAsync();

            // Lấy danh sách ngày nghỉ
            var holidays = await _uow.Holidays
                .GetAll()
                .Select(h => h.Date)
                .ToListAsync();

            // Bỏ thứ 7 nếu không làm
            if (!week.HasSaturday)
            {
                list = list
                    .Where(p => p.ForecastPlanning.PlanningDate.DayOfWeek != DayOfWeek.Saturday)
                    .ToList();
            }

            // Bỏ ngày nghỉ
            list = list
                .Where(p => !holidays.Contains(p.ForecastPlanning.PlanningDate))
                .ToList();

            // Nhóm theo ProcessId
            var totalHoursByProcess = list
                .GroupBy(p => p.ProcessId)
                .ToDictionary(
                    g => g.Key,
                    g => g.Sum(x => x.WorkingHour)
                );

            return totalHoursByProcess;
        }
    }

    public class UpdateWorkingHourDto
    {
        public Guid ForecastId { get; set; }
        public Guid ForecastWeekId { get; set; }
        public int DepartmentId { get; set; }
        public int ProcessId { get; set; }
        public string Date { get; set; } = string.Empty;
        public decimal WorkingHour { get; set; }
    }

    public class UpdateHasSaturdayDto
    {
        public Guid ForecastWeekId { get; set; }
        public bool HasSaturday { get; set; }
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
