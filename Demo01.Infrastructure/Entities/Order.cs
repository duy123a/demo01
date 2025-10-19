using Demo01.Infrastructure.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("Orders")]
    public class Order : BaseEntity
    {
        [Key]
        public Guid OrderId { get; set; } = Guid.NewGuid();

        [MaxLength(20)]
        public string SapOrderNumber { get; set; } = string.Empty;

        [MaxLength(20)]
        public OrderStatus Status { get; set; } = OrderStatus.None;

        // Navigation
        public ICollection<ForecastItem> ForecastItems { get; set; } = new List<ForecastItem>();
    }
}
