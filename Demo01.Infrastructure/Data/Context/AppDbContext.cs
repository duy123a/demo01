using Demo01.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Demo01.Infrastructure.Data.Context
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Forecast> Forecasts => Set<Forecast>();
        public DbSet<ForecastWeek> ForecastWeeks => Set<ForecastWeek>();
        public DbSet<ForecastItem> ForecastItems => Set<ForecastItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<Model> Models => Set<Model>();
        public DbSet<ModelVariant> ModelVariants => Set<ModelVariant>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Forecast>()
                .HasMany(f => f.Weeks)
                .WithOne(w => w.Forecast)
                .HasForeignKey(w => w.ForecastId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ForecastWeek>()
                .HasMany(w => w.Items)
                .WithOne(i => i.ForecastWeek)
                .HasForeignKey(i => i.ForecastWeekId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Order>()
                .HasMany(o => o.ForecastItems)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Model>()
                .HasMany(m => m.Variants)
                .WithOne(v => v.Model)
                .HasForeignKey(v => v.ModelId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
