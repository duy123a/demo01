﻿using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Entities;

namespace Demo01.Infrastructure.Data.Repositories
{
    public class ModelRepository(IRepositoryBase<Model> repositoryBase)
        : RepositoryAres<Model>(repositoryBase), IModelRepository
    {
    }
}
