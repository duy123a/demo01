using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class ProcessRepository(IRepositoryBase<Process> repositoryBase)
        : RepositoryAres<Process>(repositoryBase), IProcessRepository
    {
    }
}
