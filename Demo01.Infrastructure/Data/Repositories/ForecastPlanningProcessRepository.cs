using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class ForecastPlanningProcessRepository(IRepositoryBase<ForecastPlanningProcess> repositoryBase)
        : RepositoryAres<ForecastPlanningProcess>(repositoryBase), IForecastPlanningProcessRepository
    {
    }
}
