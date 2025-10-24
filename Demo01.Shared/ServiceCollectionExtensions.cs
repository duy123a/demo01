using Demo01.Shared.Configurations;
using Demo01.Shared.Services;
using Demo01.Shared.Services.Interfaces;
using Demo01.Shared.Utilities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;

namespace Demo01.Shared
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddAppLocalization(this IServiceCollection services)
        {
            var cultures = SupportedCultures.All.Select(c => new CultureInfo(c)).ToList();

            services.AddLocalization();

            services.Configure<RequestLocalizationOptions>(options =>
            {
                options.DefaultRequestCulture = new RequestCulture(SupportedCultures.Vietnamese);
                options.SupportedCultures = cultures;
                options.SupportedUICultures = cultures;

                options.RequestCultureProviders = new List<IRequestCultureProvider>
                {
                    new QueryStringRequestCultureProvider(),   // ?culture=vi
                    new CookieRequestCultureProvider
                    {
                        CookieName = CookieRequestCultureProvider.DefaultCookieName
                    },
                    new AcceptLanguageHeaderRequestCultureProvider() // Accept-Language: vi-VN
                };
            });

            return services;
        }

        public static IServiceCollection AddSharedService(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<SmtpSettings>(configuration.GetSection("SmtpSettings"));
            services.AddSingleton<IEmailSender, MailKitEmailSender>();
            services.AddScoped<IBlobStorageService, BlobStorageService>();
            services.AddScoped<IGoogleHolidayService, GoogleHolidayService>();

            return services;
        }
    }
}
