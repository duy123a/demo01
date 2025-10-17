using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("Models")]
    public class Model : BaseEntity
    {
        [Key]
        public Guid ModelId { get; set; } = Guid.NewGuid();

        [MaxLength(100)]
        public string ModelName { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Description { get; set; }

        // Navigation
        public ICollection<ModelVariant> Variants { get; set; } = new List<ModelVariant>();
    }
}
