using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("Holidays")]
    public class Holiday : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        public DateTimeOffset Date { get; set; }
        public string? Description { get; set; }
    }
}
