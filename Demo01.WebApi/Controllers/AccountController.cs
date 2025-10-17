using Demo01.Infrastructure.Configurations;
using Demo01.Infrastructure.Entities;
using Demo01.Infrastructure.Enums;
using Demo01.Shared.Resources;
using Demo01.Shared.Services;
using Demo01.Shared.Services.Interfaces;
using Demo01.WebApi.ViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;

namespace Demo01.WebApi.Controllers
{
    public class AccountController : Controller
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly IStringLocalizer<SharedResources> _localizer;
        private readonly IEmailSender _emailSender;
        private readonly IBlobStorageService _blobStorage;
        private readonly ILogger<AccountController> _logger;
        private readonly CookieSettings _cookieSettings;

        public AccountController(
            SignInManager<AppUser> signInManager,
            UserManager<AppUser> userManager,
            IStringLocalizer<SharedResources> localizer,
            IEmailSender emailSender,
            IBlobStorageService blobStorage,
            ILogger<AccountController> logger,
            IOptions<CookieSettings> cookieSettings)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _localizer = localizer;
            _emailSender = emailSender;
            _blobStorage = blobStorage;
            _logger = logger;
            _cookieSettings = cookieSettings.Value;
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            if (User.Identity!.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewData["ReturnUrl"] = returnUrl ?? Url.Content("~/");
            return View(new LoginViewModel());
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl ?? Url.Content("~/");

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                ModelState.AddModelError(string.Empty, _localizer["Login_Failed"]);
                return View(model);
            }

            if (await _userManager.IsLockedOutAsync(user))
            {
                ModelState.AddModelError(string.Empty, _localizer["Login_Locked_Out"]);
                return View(model);
            }

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                ModelState.AddModelError(string.Empty, _localizer["Login_Not_Allowed"]);
                return View(model);
            }

            if (!await _userManager.IsInRoleAsync(user, AppRole.Admin.ToString())
                && !await _userManager.IsInRoleAsync(user, AppRole.User.ToString()))
            {
                ModelState.AddModelError(string.Empty, _localizer["Login_Role_Not_Allowed"]);
                return View(model);
            }

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = model.RememberMe
                    ? DateTimeOffset.UtcNow.AddDays(_cookieSettings.RememberMeExpireDays)
                    : DateTimeOffset.UtcNow.AddSeconds(_cookieSettings.DefaultExpireSeconds)
            };

            await _signInManager.SignInAsync(user, authProperties);

            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            if (!User.Identity!.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }

            await _signInManager.SignOutAsync();

            return RedirectToAction("Index", "Home");
        }

        [AllowAnonymous]
        [HttpGet("/Account/Avatar/{name}")]
        public async Task<IActionResult> Avatar(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return Redirect("/images/default-avatar.svg");
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == name);
            if (user == null || string.IsNullOrEmpty(user.ProfileImg))
            {
                return Redirect("/images/default-avatar.svg");
            }

            var fileName = user.ProfileImg;

            var stream = await _blobStorage.OpenReadAsync(BlobStorageService.UserProfileContainer, fileName);

            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(fileName, out string? contentType))
            {
                contentType = "application/octet-stream";
            }

            return File(stream, contentType);
        }

        [AllowAnonymous]
        public IActionResult AccessDenied(string returnUrl)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }
    }
}
