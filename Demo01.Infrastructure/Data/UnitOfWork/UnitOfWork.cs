using Demo01.Infrastructure.Data.Context;
using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;

namespace Demo01.Infrastructure.Data.UnitOfWork
{
    public abstract class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
