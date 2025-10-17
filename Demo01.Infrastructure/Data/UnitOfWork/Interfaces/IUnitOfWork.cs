namespace Demo01.Infrastructure.Data.UnitOfWork.Interfaces
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync();
    }
}
