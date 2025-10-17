using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class ForecastRepository(IRepositoryBase<Forecast> repositoryBase) : RepositoryAres<Forecast>(repositoryBase), IForecastRepository
    {
    }
}
