using Demo01.WebApi.Services.Interfaces;

namespace Demo01.WebApi.Services
{
    public class NotificationBackgroundService : INotificationBackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public NotificationBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        private async Task WithNotificationService(Func<INotificationService, Task> action)
        {
            using var scope = _scopeFactory.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<INotificationService>();
            await action(service);
        }

        public Task NotifyDemoAsync(string userId) =>
            WithNotificationService(s => s.NotifyDemoAsync(userId));
    }
}
