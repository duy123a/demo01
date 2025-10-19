using Demo01.Infrastructure.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("ForecastItems")]
    public class ForecastItem : BaseEntity
    {
        [Key]
        public Guid ForecastItemId { get; set; } = Guid.NewGuid();

        public Guid ForecastWeekId { get; set; }

        public Guid OrderId { get; set; }

        public Guid VariantId { get; set; }

        [MaxLength(50)]
        public string SerieNumber { get; set; } = string.Empty;

        [MaxLength(20)]
        public ForecastItemStatus Status { get; set; } = ForecastItemStatus.None;

        [MaxLength(10)]
        public string ShippingWeek { get; set; } = string.Empty;

        // Navigation
        [ForeignKey(nameof(ForecastWeekId))]
        public ForecastWeek ForecastWeek { get; set; } = default!;

        [ForeignKey(nameof(OrderId))]
        public Order Order { get; set; } = default!;

        [ForeignKey(nameof(VariantId))]
        public ModelVariant ModelVariant { get; set; } = default!;
    }
}
