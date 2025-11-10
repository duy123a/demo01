using Demo01.Infrastructure.Data.Context;
using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class NotificationRepository(IRepositoryBase<Notification> repositoryBase, AppDbContext context) : RepositoryAres<Notification>(repositoryBase), INotificationRepository
    {
        public async Task<List<Notification>> GetByUserAsync(string userId, int skip, int take)
        {
            return await context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            return await context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .CountAsync();
        }

        public async Task<Notification?> GetByIdAsync(Guid id, string userId)
        {
            return await context.Notifications
                .Where(n => n.Id == id && n.UserId == userId)
                .FirstOrDefaultAsync();
        }
    }
}
