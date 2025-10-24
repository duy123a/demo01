using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("ForecastPlanningDates")]
    public class ForecastPlanningDate : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }

        public DateTimeOffset PlanningDate { get; set; }

        public Guid ForecastPlanningId { get; set; }

        // Navigation

        [ForeignKey(nameof(ForecastPlanningId))]
        public ForecastPlanning ForecastPlanning { get; set; } = default!;

        public ICollection<ForecastPlanningProcess> ForecastPlanningProcesses { get; set; } = new List<ForecastPlanningProcess>();
    }
}
