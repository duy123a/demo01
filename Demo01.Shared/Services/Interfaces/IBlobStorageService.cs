using Microsoft.AspNetCore.Http;

namespace Demo01.Shared.Services.Interfaces
{
    public interface IBlobStorageService
    {
        Task<string> UploadFileAsync(IFormFile file, string containerName, string fileName);

        Task<string> UploadFileAsync(Stream stream, string containerName, string fileName);

        Task<Stream> OpenReadAsync(string containerName, string fileName);

        Task DeleteFileAsync(string containerName, string fileName);

        Task DeleteFilesAsync(string containerName, IEnumerable<string> fileNames);

        string ComputeFileHash(IFormFile file);
    }
}
