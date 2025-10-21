using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class DepartmentRepository(IRepositoryBase<Department> repositoryBase)
        : RepositoryAres<Department>(repositoryBase), IDepartmentRepository
    {
    }
}
