using Demo01.Infrastructure.Data.Repositories.Interfaces;

namespace Demo01.Infrastructure.Data.UnitOfWork.Interfaces
{
    public interface INotificationUnitOfWork : IUnitOfWork
    {
        INotificationRepository Notifications { get; }
    }
}
