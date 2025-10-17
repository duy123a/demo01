using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("ModelVariants")]
    public class ModelVariant : BaseEntity
    {
        [Key]
        public Guid VariantId { get; set; } = Guid.NewGuid();

        public Guid ModelId { get; set; }

        [MaxLength(10)]
        public string Size { get; set; } = string.Empty;

        [MaxLength(30)]
        public string Colour { get; set; } = string.Empty;

        [Column(TypeName = "decimal(5,2)")]
        public decimal LF { get; set; }

        // Navigation
        [ForeignKey(nameof(ModelId))]
        public Model Model { get; set; } = default!;

        public ICollection<ForecastItem> ForecastItems { get; set; } = new List<ForecastItem>();
    }
}
