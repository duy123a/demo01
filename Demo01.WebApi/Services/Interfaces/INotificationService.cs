namespace Demo01.WebApi.Services.Interfaces
{
    public interface INotificationService
    {
        Task NotifyDemoAsync(string userId);
    }
}
