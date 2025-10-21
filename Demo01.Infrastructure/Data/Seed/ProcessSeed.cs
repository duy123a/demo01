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
                new Process { Id = 1, Name = "Bottom" },
                new Process { Id = 2, Name = "Top" },
                new Process { Id = 3, Name = "Final" }
            );
        }
    }
}