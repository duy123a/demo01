using Demo01.WebApi.Services.Interfaces;
using Demo01.WebApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Demo01.WebApi.Controllers
{
    [Authorize(Roles = "Admin,User")]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly INotificationBackgroundService _notificationService;

        public HomeController(
            ILogger<HomeController> logger,
            INotificationBackgroundService notificationService)
        {
            _logger = logger;
            _notificationService = notificationService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> NotifyDemo()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            await _notificationService.NotifyDemoAsync(userId);
            return Redirect(Request.Headers["Referer"].ToString());
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        [AllowAnonymous]
        public IActionResult Error(int? statusCode = null)
        {
            var model = new ErrorViewModel();

            if (statusCode.HasValue)
            {
                model.StatusCode = statusCode.Value;
                model.Message = TempData["Error"]?.ToString() ?? statusCode switch
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
                model.Message = TempData["Error"]?.ToString() ?? "Unknown error occurred.";
            }

            return View(model);
        }
    }
}
