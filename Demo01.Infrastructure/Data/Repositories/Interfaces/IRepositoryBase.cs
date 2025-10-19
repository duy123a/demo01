using System.Linq.Expressions;

namespace Demo01.Infrastructure.Data.Repositories.Interfaces
{
    public interface IRepositoryBase<T> where T : class
    {
        IQueryable<T> GetAll();
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(object id);
        Task AddAsync(T entity);
        Task AddRangeAsync(List<T> entities);
        void Update(T entity);
        Task DeleteAsync(object id);
        void Remove(T entity);
        IQueryable<T> Where(Expression<Func<T, bool>> predicate);
        void RemoveRange(IEnumerable<T> entities);
    }
}
