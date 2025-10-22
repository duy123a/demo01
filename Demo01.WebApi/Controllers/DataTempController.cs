using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Demo01.WebApi.Controllers
{
    [Authorize]
    public class DataTempController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}