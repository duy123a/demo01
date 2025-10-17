using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class ForecastWeekRepository(IRepositoryBase<ForecastWeek> repositoryBase)
        : RepositoryAres<ForecastWeek>(repositoryBase), IForecastWeekRepository
    {
    }
}
