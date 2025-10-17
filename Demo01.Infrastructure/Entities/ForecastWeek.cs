using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("ForecastWeeks")]
    public class ForecastWeek : BaseEntity
    {
        [Key]
        public Guid ForecastWeekId { get; set; } = Guid.NewGuid();

        public Guid ForecastId { get; set; }

        public int WeekNumber { get; set; }

        [Required]
        public DateTimeOffset StartDate { get; set; }

        [Required]
        public DateTimeOffset EndDate { get; set; }

        // Navigation
        [ForeignKey(nameof(ForecastId))]
        public Forecast Forecast { get; set; } = default!;

        public ICollection<ForecastItem> Items { get; set; } = new List<ForecastItem>();
    }
}
