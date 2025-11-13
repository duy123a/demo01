using Demo01.Infrastructure.Entities;
using Demo01.Infrastructure.Entities.Interfaces;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Demo01.Infrastructure.Data.Context
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AppDbContext(
            DbContextOptions<AppDbContext> options,
            IHttpContextAccessor httpContextAccessor
        ) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public DbSet<Notification> Notifications => Set<Notification>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Global query filter for soft delete
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType))
                {
                    var method = typeof(AppDbContext)
                        .GetMethod(nameof(SetSoftDeleteFilter), BindingFlags.NonPublic | BindingFlags.Static)!
                        .MakeGenericMethod(entityType.ClrType);

                    method.Invoke(null, new object[] { modelBuilder });
                }
            }
        }

        private static void SetSoftDeleteFilter<TEntity>(ModelBuilder builder)
            where TEntity : class, ISoftDeletable
        {
            builder.Entity<TEntity>().HasQueryFilter(e => !e.IsDeleted);
        }

        public override int SaveChanges()
        {
            ApplyAuditInfo();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInfo();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAuditInfo()
        {
            var now = DateTimeOffset.UtcNow;
            var currentUser = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "system";

            foreach (var entry in ChangeTracker.Entries())
            {
                // Audit
                if (entry.Entity is IAuditable auditable)
                {
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            auditable.CreatedAt = now;
                            auditable.CreatedBy = currentUser;
                            auditable.UpdatedAt = now;
                            auditable.UpdatedBy = currentUser;
                            break;
                        case EntityState.Modified:
                            auditable.UpdatedAt = now;
                            auditable.UpdatedBy = currentUser;
                            break;
                    }
                }

                // Soft delete
                if (entry.Entity is ISoftDeletable deletable && entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    deletable.IsDeleted = true;
                    deletable.DeletedAt = now;
                    deletable.DeletedBy = currentUser;
                }
            }
        }
    }
}
