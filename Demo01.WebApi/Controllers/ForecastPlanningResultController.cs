using Demo01.Infrastructure.Data.UnitOfWork.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Demo01.WebApi.ViewModels
{
    public class ForecastPlanningResultController : Controller
    {
        private readonly IPlanningUnitOfWork _uow;

        public ForecastPlanningResultController(IPlanningUnitOfWork uow)
        {
            _uow = uow;
        }

        public IActionResult Index(Guid? forecastId = null, Guid? weekId = null)
        {
            return View();
        }
    }
}
