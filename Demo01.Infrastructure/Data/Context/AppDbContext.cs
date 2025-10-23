using Demo01.Infrastructure.Data.Seed;
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
        public DbSet<Department> Departments => Set<Department>();
        public DbSet<Process> Processes => Set<Process>();
        public DbSet<ForecastPlanning> ForecastPlannings => Set<ForecastPlanning>();
        public DbSet<ForecastPlanningDate> ForecastPlanningDates => Set<ForecastPlanningDate>();
        public DbSet<Holiday> Holidays => Set<Holiday>();
        public DbSet<ForecastPlanningProcess> ForecastPlanningProcesses => Set<ForecastPlanningProcess>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Forecast → ForecastWeeks
            builder.Entity<Forecast>()
                .HasMany(f => f.ForecastWeeks)
                .WithOne(w => w.Forecast)
                .OnDelete(DeleteBehavior.Cascade);

            // ForecastWeek → ForecastItems
            builder.Entity<ForecastWeek>()
                .HasMany(w => w.ForecastItems)
                .WithOne(i => i.ForecastWeek)
                .OnDelete(DeleteBehavior.Cascade);

            // Order → ForecastItems
            builder.Entity<Order>()
                .HasMany(o => o.ForecastItems)
                .WithOne(i => i.Order)
                .OnDelete(DeleteBehavior.Restrict);

            // Model → Variants
            builder.Entity<Model>()
                .HasMany(m => m.Variants)
                .WithOne(v => v.Model)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique index on ForecastPlanningProcess
            builder.Entity<ForecastPlanningProcess>()
                .HasIndex(p => new { p.ForecastPlanningDateId, p.ProcessId })
                .IsUnique();

            // Seeds
            builder.ApplyConfiguration(new DepartmentSeed());
            builder.ApplyConfiguration(new ProcessSeed());
        }
    }
}
