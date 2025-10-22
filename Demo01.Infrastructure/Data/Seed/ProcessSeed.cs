using Demo01.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Demo01.Infrastructure.Data.Seed
{
    public class ProcessSeed : IEntityTypeConfiguration<Process>
    {
        public void Configure(EntityTypeBuilder<Process> builder)
        {
            builder.HasData(
                new Process { Id = 1, Name = "Fabric Receiving" },
                new Process { Id = 2, Name = "Fabric Joining" },
                new Process { Id = 3, Name = "Tail" },
                new Process { Id = 4, Name = "Bottom" },
                new Process { Id = 5, Name = "Top" },
                new Process { Id = 6, Name = "QC Final" }
            );
        }
    }
}
