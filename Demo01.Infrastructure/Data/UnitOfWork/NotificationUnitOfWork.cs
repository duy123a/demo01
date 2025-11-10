using Demo01.Infrastructure.Data.Context;
using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;

namespace Demo01.Infrastructure.Data.UnitOfWork
{
    public class NotificationUnitOfWork : UnitOfWork, INotificationUnitOfWork
    {
        private readonly AppDbContext _context;
        public INotificationRepository Notifications { get; }
        public NotificationUnitOfWork(AppDbContext context, INotificationRepository notificationRepository) : base(context)
        {
            _context = context;
            Notifications = notificationRepository;
        }
    }
}
