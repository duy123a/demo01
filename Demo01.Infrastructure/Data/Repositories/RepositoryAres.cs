using Demo01.Infrastructure.Data.Repositories.Interfaces;
using System.Linq.Expressions;

namespace Demo01.Infrastructure.Data.Repositories
{
    public abstract class RepositoryAres<TEntity>(IRepositoryBase<TEntity> wrapper) : IRepositoryBase<TEntity> where TEntity : class
    {
        public async Task AddAsync(TEntity entity)
        {
            await wrapper.AddAsync(entity);
        }

        public async Task DeleteAsync(object id)
        {
            await wrapper.DeleteAsync(id);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await wrapper.GetAllAsync();
        }

        public async Task<TEntity?> GetByIdAsync(object id)
        {
            return await wrapper.GetByIdAsync(id);
        }

        public void Update(TEntity entity)
        {
            wrapper.Update(entity);
        }

        public async Task AddRangeAsync(List<TEntity> entities)
        {
            await wrapper.AddRangeAsync(entities);
        }

        public void Remove(TEntity entity)
        {
            wrapper.Remove(entity);
        }

        public IQueryable<TEntity> Where(Expression<Func<TEntity, bool>> predicate)
        {
            return wrapper.Where(predicate);
        }

        public void RemoveRange(IEnumerable<TEntity> entities)
        {
            wrapper.RemoveRange(entities);
        }
    }
}
