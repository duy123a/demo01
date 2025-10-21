using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class HolidayRepository(IRepositoryBase<Holiday> repositoryBase)
        : RepositoryAres<Holiday>(repositoryBase), IHolidayRepository
    {
    }
}
