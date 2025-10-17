using Demo01.Infrastructure.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("Forecasts")]
    public class Forecast : BaseEntity
    {
        [Key]
        public Guid ForecastId { get; set; } = Guid.NewGuid();

        public int Year { get; set; }

        public byte Month { get; set; }

        [MaxLength(20)]
        public ForecastStatus Status { get; set; } = ForecastStatus.None;

        // Navigation
        public ICollection<ForecastWeek> Weeks { get; set; } = new List<ForecastWeek>();
    }
}
