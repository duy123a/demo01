using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Demo01.WebApi.Controllers
{
    [Authorize]
    public class MaintenanceRequestsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}