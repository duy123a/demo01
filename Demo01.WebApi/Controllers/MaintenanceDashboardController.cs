using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Demo01.WebApi.Controllers
{
    [Authorize]
    public class MaintenanceDashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}