using Demo01.Infrastructure.Data.Context;
using Demo01.Infrastructure.Entities;
using Demo01.Infrastructure.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Demo01.Infrastructure.Utilities
{
    public static class SeedManager
    {
        public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            foreach (var role in Enum.GetNames<AppRole>())
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        public static async Task SeedAdminAccountAsync(IServiceProvider serviceProvider, string adminEmail, string adminPassword)
        {
            if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword)) return;

            var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();

            var adminUser = await userManager.FindByNameAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new AppUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (!result.Succeeded)
                {
                    throw new InvalidOperationException("Failed to create admin user: " +
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                await userManager.AddToRoleAsync(adminUser, AppRole.Admin.ToString());
            }
            else
            {
                // Ensure role Admin
                if (!await userManager.IsInRoleAsync(adminUser, AppRole.Admin.ToString()))
                {
                    await userManager.AddToRoleAsync(adminUser, AppRole.Admin.ToString());
                }
            }
        }

        public static async Task SeedDemoAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Apply migration nếu cần
            await db.Database.MigrateAsync();

            // Kiểm tra nếu đã có forecast thì bỏ qua seed
            if (await db.Forecasts.AnyAsync())
                return;

            var filePath = Path.Combine(AppContext.BaseDirectory, "Data", "Seed", "demo.xlsx");
            if (!File.Exists(filePath))
            {
                Console.WriteLine($"❌ File not found: {filePath}");
                return;
            }

            Console.WriteLine("📦 Seeding data from Excel...");

            var importer = new ExcelForecastImporter(db);
            var result = await importer.ImportFromFileAsync(filePath);

            if (result.Success)
            {
                Console.WriteLine($"✅ Import completed: {result.InsertedItems} items inserted from {result.ProcessedSheets.Count} sheets.");
            }
            else
            {
                Console.WriteLine($"❌ Import failed: {result.Error}");
            }
        }
    }
}
