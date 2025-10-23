using Demo01.Infrastructure.Data.Repositories.Interfaces;

namespace Demo01.Infrastructure.Data.UnitOfWork.Interfaces
{
    public interface IPlanningUnitOfWork : IUnitOfWork
    {
        IForecastRepository Forecasts { get; }
        IForecastItemRepository ForecastItems { get; }
        IForecastWeekRepository ForecastWeeks { get; }
        IModelRepository Models { get; }
        IModelVariantRepository ModelVariants { get; }
        IOrderRepository Orders { get; }
        IDepartmentRepository Departments { get; }
        IProcessRepository Processes { get; }
        IHolidayRepository Holidays { get; }
        IForecastPlanningRepository ForecastPlannings { get; }
        IForecastPlanningDateRepository ForecastPlanningDates { get; }
        IForecastPlanningProcessRepository ForecastPlanningProcesses { get; }
    }
}
