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
                new Department
                {
                    Id = 1,
                    Name = "Parachute Department",
                    Capacity = 0,
                    LfRate = 0
                },
                new Department
                {
                    Id = 2,
                    Name = "Cutting Department",
                    Capacity = 0,
                    LfRate = 0
                },
                new Department
                {
                    Id = 3,
                    Name = "Strap Department",
                    Capacity = 0,
                    LfRate = 0
                },
                new Department
                {
                    Id = 4,
                    Name = "Packaging Department",
                    Capacity = 0,
                    LfRate = 0
                }
            );
        }
    }
}
