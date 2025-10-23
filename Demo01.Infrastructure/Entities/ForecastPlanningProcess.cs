using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("ForecastPlanningProcesses")]
    public class ForecastPlanningProcess : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ForecastPlanningDateId { get; set; }

        [Required]
        public int ProcessId { get; set; }

        public decimal WorkingHour { get; set; }

        public decimal ActualLf { get; set; }

        public decimal TargetLf { get; set; }

        // Navigation
        [ForeignKey(nameof(ForecastPlanningDateId))]
        public ForecastPlanningDate ForecastPlanningDate { get; set; } = default!;

        [ForeignKey(nameof(ProcessId))]
        public Process Process { get; set; } = default!;
    }
}
