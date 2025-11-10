using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;
using Demo01.Infrastructure.Entities;
using Demo01.Infrastructure.Enums;
using Demo01.WebApi.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace Demo01.WebApi.Services
{
    public class AppNotificationService : IAppNotificationService
    {
        private readonly INotificationUnitOfWork _notificationUnitOfWork;
        private readonly IHttpClientFactory _httpFactory;
        private readonly IConfiguration _config;
        private readonly ILogger<AppNotificationService> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AppNotificationService(
            INotificationUnitOfWork notificationUnitOfWork,
            IHttpClientFactory httpFactory,
            IConfiguration config,
            ILogger<AppNotificationService> logger,
            UserManager<AppUser> userManager,
            IHttpContextAccessor httpContextAccessor)
        {
            _notificationUnitOfWork = notificationUnitOfWork;
            _httpFactory = httpFactory;
            _config = config;
            _logger = logger;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task CreateAsync(
            string userId,
            string titleKey,
            string messageKey,
            List<string>? titleParams = null,
            List<string>? messageParams = null,
            string? url = null)
        {
            var notification = new Notification
            {
                UserId = userId,
                TitleKey = titleKey,
                TitleParams = titleParams != null ? JsonSerializer.Serialize(titleParams) : null,
                MessageKey = messageKey,
                MessageParams = messageParams != null ? JsonSerializer.Serialize(messageParams) : null,
                Url = url,
                IsRead = false,
                CreatedAt = DateTimeOffset.UtcNow
            };

            await _notificationUnitOfWork.Notifications.AddAsync(notification);
            await _notificationUnitOfWork.SaveChangesAsync();
        }

        public async Task CreateAsync(Notification notification)
        {
            if (notification == null) return;

            await _notificationUnitOfWork.Notifications.AddAsync(notification);
            await _notificationUnitOfWork.SaveChangesAsync();
        }

        public async Task<List<Notification>> GetAsync(string userId, int skip, int take)
        {
            return await _notificationUnitOfWork.Notifications.GetByUserAsync(userId, skip, take);
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            return await _notificationUnitOfWork.Notifications.GetUnreadCountAsync(userId);
        }

        public async Task MarkAsReadAsync(Guid notificationId, string userId)
        {
            var notification = await _notificationUnitOfWork.Notifications.GetByIdAsync(notificationId, userId);

            if (notification != null && !notification.IsRead)
            {
                notification.IsRead = true;
                _notificationUnitOfWork.Notifications.Update(notification);
                await _notificationUnitOfWork.SaveChangesAsync();
            }
        }

        public async Task<Notification?> FindAsync(Guid notificationId)
        {
            return await _notificationUnitOfWork.Notifications.GetByIdAsync(notificationId);
        }

        public async Task TriggerAsync(Guid notificationId)
        {
            var client = _httpFactory.CreateClient();
            client.DefaultRequestHeaders.Add("X-Notification-Key", _config["Notification:ApiKey"]);

            var request = _httpContextAccessor.HttpContext?.Request;
            var currentDomain = $"{request?.Scheme}://{request?.Host}";
            var url = $"{currentDomain}/api/notification/trigger";

            var payload = new { NotificationId = notificationId };
            try
            {
                var res = await client.PostAsJsonAsync(url, payload);
                if (!res.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Trigger to UserApp failed: {Status}", res.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling UserApp trigger API");
            }
        }

        public async Task TriggerAdminAsync(Guid notificationId)
        {
            var client = _httpFactory.CreateClient();
            client.DefaultRequestHeaders.Add("X-Notification-Key", _config["Notification:ApiKey"]);

            var request = _httpContextAccessor.HttpContext?.Request;
            var currentDomain = $"{request?.Scheme}://{request?.Host}";
            var url = $"{currentDomain}/api/notification/trigger-all-admin";

            var payload = new { NotificationId = notificationId };
            try
            {
                var res = await client.PostAsJsonAsync(url, payload);
                if (!res.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Trigger to AdminApp failed: {Status}", res.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling AdminApp trigger API");
            }
        }

        public async Task<Guid?> CreateAdminAsync(Notification notification)
        {
            if (notification == null) return null;

            var adminUsers = await _userManager.GetUsersInRoleAsync(AppRole.Admin.ToString());
            Notification? firstNotif = null;

            foreach (var admin in adminUsers)
            {
                var notif = new Notification
                {
                    UserId = admin.Id,
                    TitleKey = notification.TitleKey,
                    TitleParams = notification.TitleParams,
                    MessageKey = notification.MessageKey,
                    MessageParams = notification.MessageParams,
                    Url = notification.Url,
                    CreatedAt = DateTimeOffset.UtcNow
                };

                await _notificationUnitOfWork.Notifications.AddAsync(notif);

                // use first id as a representation
                firstNotif ??= notif;
            }

            await _notificationUnitOfWork.SaveChangesAsync();

            return firstNotif?.Id;
        }
    }
}
