using Demo01.Infrastructure;
using Demo01.Infrastructure.Utilities;
using Demo01.Shared;
using Demo01.Shared.Services;
using Demo01.Shared.Utilities;
using Demo01.WebApi.Services;
using Demo01.WebApi.Services.Interfaces;
using Vite.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews(o => o.AddStringTrimModelBinderProvider());
builder.Services.AddViteServices(options =>
{
    options.Base = "dist";
    options.Server.AutoRun = true;
});
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 100 * 1024 * 1024; // 100 MB
});

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
var adminEmail = builder.Configuration["SeedUsers:AdminEmail"] ?? string.Empty;
var adminPassword = builder.Configuration["SeedUsers:AdminPassword"] ?? string.Empty;

builder.Services.AddAppLocalization();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddSharedService(builder.Configuration);
builder.Services.AddHttpContextAccessor();
builder.Services.AddSignalR();

// config origin
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins!)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services.AddScoped<IAppNotificationService, AppNotificationService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<INotificationBackgroundService, NotificationBackgroundService>();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseStatusCodePagesWithReExecute("/Home/Error", "?statusCode={0}");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // NOSONAR
    app.UseMigrationsEndPoint();
}

app.UseHttpsRedirection();

using (var scope = app.Services.CreateScope())
{
    await SeedManager.SeedRolesAsync(scope.ServiceProvider);
    await SeedManager.SeedAdminAccountAsync(scope.ServiceProvider, adminEmail, adminPassword);
}

app.UseRequestLocalization();
app.UseCors();

app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

if (app.Environment.IsDevelopment())
{
    app.UseWebSockets();
    app.UseViteDevelopmentServer(true);
}

app.MapHub<NotificationHub>("/notificationHub");

app.Run();
