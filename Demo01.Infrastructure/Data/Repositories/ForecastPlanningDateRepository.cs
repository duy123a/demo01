using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class ForecastPlanningDateRepository(IRepositoryBase<ForecastPlanningDate> repositoryBase)
        : RepositoryAres<ForecastPlanningDate>(repositoryBase), IForecastPlanningDateRepository
    {
    }
}
