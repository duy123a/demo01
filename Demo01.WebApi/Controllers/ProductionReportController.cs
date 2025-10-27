using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Demo01.WebApi.Controllers
{
    [Authorize]
    public class ProductionReportController : Controller
    {
        // GET: ProductionReport
        public IActionResult Index()
        {
            ViewData["Title"] = "Báo cáo sản xuất";
            ViewData["Page"] = "production-report";
            return View();
        }
    }
}

