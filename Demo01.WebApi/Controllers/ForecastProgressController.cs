using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;
using Demo01.Infrastructure.Enums;
using Demo01.WebApi.ViewModels.ForecastProgressViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Demo01.WebApi.Controllers
{
    [Authorize]
    public class ForecastProgressController : Controller
    {
        private readonly IPlanningUnitOfWork _uow;
        private readonly Random _rnd = new();
        private readonly string[] issueMessages = new[]
        {
            "Order has an issue",
            "Machine malfunction",
            "Material shortage",
            "Delayed schedule"
        };

        public ForecastProgressController(IPlanningUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<IActionResult> Index(Guid? forecastId = null, Guid? weekId = null)
        {
            var vm = new ForecastProgressViewModel();

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

            if (!forecastId.HasValue && vm.Forecasts.Any())
                forecastId = vm.Forecasts.First().ForecastId;

            vm.SelectedForecastId = forecastId ?? Guid.Empty;

            // --- Week dropdown ---
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

                if (!weekId.HasValue && vm.Weeks.Any())
                    weekId = vm.Weeks.First().ForecastWeekId;

                vm.SelectedWeekId = weekId ?? Guid.Empty;
            }

            // --- Forecast items ---
            if (weekId.HasValue)
            {
                var items = await _uow.ForecastItems
                    .Where(fi => fi.ForecastWeekId == weekId)
                    .Include(fi => fi.ModelVariant)
                        .ThenInclude(mv => mv.Model)
                    .OrderBy(fi => fi.SerieNumber)
                    .ToListAsync();

                vm.Items = items.Select(fi =>
                {
                    var progress = new ForecastProgressItemViewModel
                    {
                        SerieNumber = fi.SerieNumber,
                        ModelName = fi.ModelVariant.Model.ModelName,
                        Size = fi.ModelVariant.Size,
                        Colour = fi.ModelVariant.Colour
                    };

                    return GenerateRandomProgress(progress);
                }).ToList();
            }

            return View(vm);
        }

        private ForecastProgressItemViewModel GenerateRandomProgress(ForecastProgressItemViewModel item)
        {
            var steps = new[]
            {
                item.CuttingReceivedFabric,
                item.SpreadFabric,
                item.CutFabric,
                item.ParachuteReceivedFabric,
                item.JoinFabric,
                item.SewTail,
                item.SewBottom,
                item.SewTop,
                item.QcFinal,
                item.Packing
            };

            bool finished = true;
            bool hasSetInProgressOrIssue = false;

            foreach (var step in steps)
            {
                if (!finished)
                {
                    step.Status = ProgressStatus.NotStarted;
                    continue;
                }

                if (!hasSetInProgressOrIssue)
                {
                    int choice = _rnd.Next(0, 100);
                    if (choice < 70) // 70% Done
                    {
                        step.Status = ProgressStatus.Done;
                    }
                    else if (choice < 85) // 15% InProgress
                    {
                        step.Status = ProgressStatus.InProgress;
                        hasSetInProgressOrIssue = true;
                        finished = false;
                    }
                    else // 15% HasIssue
                    {
                        step.Status = ProgressStatus.HasIssue;
                        step.Message = issueMessages[_rnd.Next(issueMessages.Length)];
                        hasSetInProgressOrIssue = true;
                        finished = false;
                    }
                }
                else
                {
                    step.Status = ProgressStatus.NotStarted;
                }
            }

            return item;
        }
    }
}
