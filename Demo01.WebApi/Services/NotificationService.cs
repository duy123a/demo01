using Demo01.Infrastructure.Entities;
using Demo01.Shared.Resources;
using Demo01.WebApi.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;

namespace Demo01.WebApi.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IAppNotificationService _appNotificationService;
        private readonly IStringLocalizer<SharedResources> _localizer;
        private readonly ILogger<NotificationService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<AppUser> _userManager;
        private readonly string _baseUrl;

        public NotificationService(
            IAppNotificationService appNotificationService,
            IStringLocalizer<SharedResources> localizer,
            ILogger<NotificationService> logger,
            IHttpContextAccessor httpContextAccessor,
            UserManager<AppUser> userManager)
        {
            _appNotificationService = appNotificationService;
            _localizer = localizer;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;

            var request = _httpContextAccessor.HttpContext?.Request;
            _baseUrl = $"{request?.Scheme}://{request?.Host}";
        }

        private async Task CreateAndTriggerAdminNotification(Notification notification)
        {
            var notifId = await _appNotificationService.CreateAdminAsync(notification);
            if (notifId.HasValue)
            {
                await _appNotificationService.TriggerAdminAsync(notifId.Value);
            }
        }

        private async Task CreateAndTriggerUserNotification(Notification notification)
        {
            await _appNotificationService.CreateAsync(notification);
            await _appNotificationService.TriggerAsync(notification.Id);
        }

        public async Task NotifyDemoAsync(string userId)
        {
            try
            {
                var appUser = await _userManager.FindByIdAsync(userId);
                if (appUser == null)
                {
                    _logger.LogWarning("Cannot send notification. User {UserId} not found", userId);
                    return;
                }

                var notification = new Notification
                {
                    UserId = userId,
                    TitleKey = "AppNotice_Demo_Notice_Title",
                    MessageKey = "AppNotice_Demo_Notice_Message",
                    Url = _baseUrl
                };
                await CreateAndTriggerUserNotification(notification);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send user status notification for UserId {UserId}", userId);
            }
        }
    }
}
