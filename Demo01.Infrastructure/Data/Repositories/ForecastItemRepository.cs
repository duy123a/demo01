using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class ForecastItemRepository(IRepositoryBase<ForecastItem> repositoryBase)
        : RepositoryAres<ForecastItem>(repositoryBase), IForecastItemRepository
    {
    }
}
