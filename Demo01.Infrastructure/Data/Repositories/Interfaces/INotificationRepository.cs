using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories.Interfaces
{
    public interface INotificationRepository : IRepositoryBase<Notification>
    {
        Task<List<Notification>> GetByUserAsync(string userId, int skip, int take);

        Task<int> GetUnreadCountAsync(string userId);

        Task<Notification?> GetByIdAsync(Guid id, string userId);
    }
}
