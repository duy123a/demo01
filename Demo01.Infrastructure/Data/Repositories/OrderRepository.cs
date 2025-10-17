using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class OrderRepository(IRepositoryBase<Order> repositoryBase)
        : RepositoryAres<Order>(repositoryBase), IOrderRepository
    {
    }
}
