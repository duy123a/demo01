using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo01.Infrastructure.Entities
{
    [Table("Notifications")]
    public class Notification : BaseEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public string UserId { get; set; } = null!;
        public AppUser User { get; set; } = null!;

        public string? SenderId { get; set; }
        public AppUser? Sender { get; set; }

        [MaxLength(200)]
        public string TitleKey { get; set; } = null!;
        public string? TitleParams { get; set; }

        [MaxLength(200)]
        public string MessageKey { get; set; } = null!;
        public string? MessageParams { get; set; }

        [MaxLength(500)]
        public string? Url { get; set; }

        public bool IsRead { get; set; } = false;
    }
}
