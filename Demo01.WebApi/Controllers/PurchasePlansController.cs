using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Demo01.WebApi.Controllers
{
    [Authorize]
    public class PurchasePlansController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}