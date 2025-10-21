using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("ForecastPlannings")]
    public class ForecastPlanning : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        public DateOnly PlanningDate { get; set; }
        public Guid ForecastWeekId { get; set; }

        // Navigation

        [ForeignKey(nameof(ForecastWeekId))]
        public ForecastWeek ForecastWeek { get; set; } = default!;
    }
}
