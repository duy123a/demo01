using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;
using Demo01.WebApi.ViewModels.ForecastCreateViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Demo01.WebApi.Controllers
{
    public class ForecastCreateController : Controller
    {
        private readonly IPlanningUnitOfWork _uow;

        public ForecastCreateController(IPlanningUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet]
        public async Task<IActionResult> Index(Guid? forecastId = null, Guid? weekId = null)
        {
            var forecasts = await _uow.Forecasts.GetAll().ToListAsync();

            // Nếu chưa chọn forecast thì mặc định lấy forecast đầu tiên
            forecastId ??= forecasts.FirstOrDefault()?.ForecastId ?? Guid.Empty;

            // Lấy danh sách weeks theo forecast
            var weeks = await _uow.ForecastWeeks
                .GetAll()
                .Where(w => w.ForecastId == forecastId)
                .OrderBy(w => w.WeekNumber)
                .ToListAsync();

            // Nếu chưa chọn week thì mặc định lấy week đầu tiên của forecast đó
            weekId ??= weeks.FirstOrDefault()?.ForecastWeekId ?? Guid.Empty;

            // Lấy toàn bộ orders
            var allOrders = await _uow.Orders.GetAll().ToListAsync();

            // Lấy các order thuộc về week này (bảng ForecastItems có OrderId và ForecastWeekId)
            var weekOrderIds = await _uow.ForecastItems
                .GetAll()
                .Where(fi => fi.ForecastWeekId == weekId)
                .Select(fi => fi.OrderId)
                .Distinct()
                .ToListAsync();

            var vm = new ForecastCreateViewModel
            {
                ForecastId = forecastId.Value,
                WeekId = weekId.Value,

                Forecasts = forecasts.Select(f => new DropdownOption
                {
                    Id = f.ForecastId,
                    DisplayName = $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(f.Month)} {f.Year}"
                }).ToList(),

                Weeks = weeks.Select(w => new DropdownOption
                {
                    Id = w.ForecastWeekId,
                    DisplayName = $"Week {w.WeekNumber:D2} ({w.StartDate:dd/MM} - {w.EndDate:dd/MM})"
                }).ToList(),

                Orders = allOrders.Select(o => new OrderViewModel
                {
                    OrderId = o.OrderId,
                    SapOrderNumber = o.SapOrderNumber,
                    IsAssigned = weekOrderIds.Contains(o.OrderId)
                })
                .OrderBy(o => o.IsAssigned ? 0 : 1) // Đưa các order đã được gán lên đầu
                .ToList()
            };

            return View(vm);
        }

        [HttpGet]
        public async Task<IActionResult> GetItemsByOrder(Guid orderId, Guid weekId)
        {
            var items = await _uow.ForecastItems
                .GetAll()
                .Include(f => f.ModelVariant)
                    .ThenInclude(v => v.Model)
                .Where(f => f.OrderId == orderId)
                .Select(fi => new
                {
                    fi.ForecastItemId,
                    fi.OrderId,
                    fi.SerieNumber,
                    ModelName = fi.ModelVariant.Model.ModelName,
                    fi.ModelVariant.Size,
                    fi.ModelVariant.Colour
                })
                .ToListAsync();

            return Json(items);
        }
    }
}
