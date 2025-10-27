using Demo01.Shared.Resources;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace Demo01.WebApi.Controllers
{
    public class MaintenanceScheduleController : Controller
    {
        private readonly IStringLocalizer<SharedResources> _localizer;

        public MaintenanceScheduleController(IStringLocalizer<SharedResources> localizer)
        {
            _localizer = localizer;
        }

        public IActionResult Index()
        {
            ViewData["Title"] = _localizer["Calendar_Title"];
            ViewData["Page"] = "maintenance-schedule";
            return View();
        }
    }
}