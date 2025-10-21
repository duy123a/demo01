using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class ForecastPlanningRepository(IRepositoryBase<ForecastPlanning> repositoryBase)
        : RepositoryAres<ForecastPlanning>(repositoryBase), IForecastPlanningRepository
    {
    }
}
