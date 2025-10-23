using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("ForecastPlannings")]
    public class ForecastPlanning : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }

        public bool HasSaturday { get; set; }

        public Guid ForecastWeekId { get; set; }

        public int DepartmentId { get; set; }

        // Navigation

        [ForeignKey(nameof(ForecastWeekId))]
        public ForecastWeek ForecastWeek { get; set; } = default!;

        public ICollection<ForecastPlanningDate> ForecastPlanningDates { get; set; } = new List<ForecastPlanningDate>();

        [ForeignKey(nameof(DepartmentId))]
        public Department Department { get; set; } = default!;
    }
}
