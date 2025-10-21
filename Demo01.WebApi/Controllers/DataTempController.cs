using Microsoft.AspNetCore.Mvc;

namespace Demo01.WebApi.Controllers
{
    public class DataTempController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}