using Demo01.Infrastructure.Data.Context;
using Demo01.Infrastructure.Data.Repositories.Interfaces;
using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;

namespace Demo01.Infrastructure.Data.UnitOfWork
{
    public class PlanningUnitOfWork : UnitOfWork, IPlanningUnitOfWork
    {
        private readonly AppDbContext _context;
        public IForecastRepository Forecasts { get; }
        public IForecastItemRepository ForecastItems { get; }
        public IForecastWeekRepository ForecastWeeks { get; }
        public IModelRepository Models { get; }
        public IModelVariantRepository ModelVariants { get; }
        public IOrderRepository Orders { get; }

        public PlanningUnitOfWork(
            AppDbContext context,
            IForecastRepository forecasts,
            IForecastItemRepository forecastItems,
            IForecastWeekRepository forecastWeeks,
            IModelRepository models,
            IModelVariantRepository modelVariants,
            IOrderRepository orders)
            : base(context)
        {
            _context = context;
            Forecasts = forecasts;
            ForecastItems = forecastItems;
            ForecastWeeks = forecastWeeks;
            Models = models;
            ModelVariants = modelVariants;
            Orders = orders;
        }
    }
}
