﻿using Demo01.Infrastructure.Entities;
using Demo01.Infrastructure.Enums;
using Microsoft.AspNetCore.Identity;

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
    }
}
