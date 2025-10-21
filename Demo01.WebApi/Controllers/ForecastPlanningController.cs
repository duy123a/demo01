using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;
using Demo01.WebApi.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Demo01.WebApi.Controllers
{
    public class ForecastPlanningController : Controller
    {
        private readonly IPlanningUnitOfWork _uow;

        public ForecastPlanningController(IPlanningUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<IActionResult> Index(Guid? forecastId = null, Guid? weekId = null)
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

            // --- ForecastWeek dropdown ---
            if (forecastId.HasValue)
            {
                vm.Weeks = await _uow.ForecastWeeks
                    .GetAll()
                    .Where(w => w.ForecastId == forecastId)
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
                vm.SelectedWeekTotalLf = await _uow.ForecastWeeks
                    .Where(w => w.ForecastWeekId == weekId)
                    .Select(w => w.TotalLf)
                    .FirstOrDefaultAsync();
            }

            // --- ForecastItem list ---
            if (weekId.HasValue)
            {
                var items = await _uow.ForecastItems
                    .Where(i => i.ForecastWeekId == weekId)
                    .Include(i => i.Order)
                    .Include(i => i.ModelVariant)
                        .ThenInclude(v => v.Model)
                    .OrderBy(i => i.SerieNumber)
                    .ToListAsync();

                vm.Items = items.Select((i, idx) => new ForecastItemViewModel
                {
                    No = idx + 1,
                    SerieNumber = i.SerieNumber,
                    ModelName = i.ModelVariant.Model.ModelName,
                    Size = i.ModelVariant.Size,
                    Colour = i.ModelVariant.Colour,
                    SapOrder = i.Order.SapOrderNumber,
                    Lf = i.ModelVariant.Lf
                }).ToList();
            }

            return View(vm);
        }

        public IActionResult PlanForecast(Guid forecastId)
        {
            return RedirectToAction(nameof(Index), new { forecastId });
        }
    }
}
