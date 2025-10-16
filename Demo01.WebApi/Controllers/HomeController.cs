using Demo01.WebApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Demo01.WebApi.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        [AllowAnonymous]
        public IActionResult Error(int? statusCode = null)
        {
            var model = new ErrorViewModel();

            if (statusCode.HasValue)
            {
                model.StatusCode = statusCode.Value;
                model.Message = TempData["ErrorMessage"]?.ToString() ?? statusCode switch
                {
                    404 => "Page not found.",
                    403 => "Access denied.",
                    401 => "Unauthorized.",
                    _ => "An unexpected error occurred."
                };

                return View(model);
            }

            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
            if (exceptionFeature != null)
            {
                model.StatusCode = 500;
                model.Message = exceptionFeature.Error.Message;
            }
            else
            {
                model.StatusCode = 500;
                model.Message = TempData["ErrorMessage"]?.ToString() ?? "Unknown error occurred.";
            }

            return View(model);
        }
    }
}
