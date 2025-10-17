using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class ModelVariantRepository(IRepositoryBase<ModelVariant> repositoryBase)
        : RepositoryAres<ModelVariant>(repositoryBase), IModelVariantRepository
    {
    }
}
