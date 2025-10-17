using Demo01.Shared.Utilities;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;

namespace Demo01.WebApi.Controllers
{
    public class CultureController : Controller
    {
        [HttpPost]
        public IActionResult SetLanguage(string culture, string returnUrl)
        {
            var selectedCulture = culture?.ToLower() == SupportedCultures.Vietnamese
                ? SupportedCultures.Vietnamese
                : SupportedCultures.English;

            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(selectedCulture)),
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddYears(1),
                    Secure = true,
                    HttpOnly = true
                }
            );

            return LocalRedirect(returnUrl ?? "/");
        }
    }
}
