using Demo01.Infrastructure.Entities;

namespace Demo01.WebApi.Services.Interfaces
{
    public interface IAppNotificationService
    {
        Task CreateAsync(
            string userId,
            string titleKey,
            string messageKey,
            List<string>? titleParams = null,
            List<string>? messageParams = null,
            string? url = null);

        Task CreateAsync(Notification notification);

        Task<List<Notification>> GetAsync(string userId, int skip, int take);

        Task<int> GetUnreadCountAsync(string userId);

        Task MarkAsReadAsync(Guid notificationId, string userId);

        Task<Notification?> FindAsync(Guid notificationId);

        Task TriggerAsync(Guid notificationId);

        Task TriggerAdminAsync(Guid notificationId);

        Task<Guid?> CreateAdminAsync(Notification notification);
    }
}
