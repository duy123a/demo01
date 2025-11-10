namespace Demo01.WebApi.Services.Interfaces
{
    public interface INotificationBackgroundService
    {
        Task NotifyDemoAsync(string userId);
    }
}
