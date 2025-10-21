using Demo01.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Demo01.Infrastructure.Data.Seed
{
    public class DepartmentSeed : IEntityTypeConfiguration<Department>
    {
        public void Configure(EntityTypeBuilder<Department> builder)
        {
            builder.HasData(
                new Department { Id = 1, Name = "Bộ phận cắt", Capacity = 0, LfRate = 0 },
                new Department { Id = 2, Name = "Bộ phận đai", Capacity = 0, LfRate = 0 },
                new Department { Id = 3, Name = "Bộ phận dù", Capacity = 0, LfRate = 0 },
                new Department { Id = 4, Name = "Bộ phận đóng gói", Capacity = 0, LfRate = 0 },
                new Department { Id = 5, Name = "Bộ phận QC", Capacity = 0, LfRate = 0 }
            );
        }
    }
}
