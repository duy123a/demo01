namespace Demo01.Shared.Services.Interfaces
{
    public interface IHttpClientService
    {
        Task<T?> GetAsync<T>(string url);
        Task<T?> PostAsync<T>(string url, object data);
    }
}
