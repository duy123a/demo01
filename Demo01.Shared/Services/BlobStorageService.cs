using Azure.Storage.Blobs;
using Demo01.Shared.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Demo01.Shared.Services
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly string _connectionString;

        public const string UserProfileContainer = "user-profile-images";

        public BlobStorageService(IConfiguration config)
        {
            _connectionString = config["AzureBlob:ConnectionString"]!;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string containerName, string fileName)
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            await containerClient.CreateIfNotExistsAsync();

            var blobClient = containerClient.GetBlobClient(fileName);

            using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, overwrite: true);

            return fileName;
        }

        public async Task<string> UploadFileAsync(Stream stream, string containerName, string fileName)
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            await containerClient.CreateIfNotExistsAsync();

            var blobClient = containerClient.GetBlobClient(fileName);

            // Reset stream to the beginning to ensure its correction
            if (stream.CanSeek)
                stream.Position = 0;

            await blobClient.UploadAsync(stream, overwrite: true);

            return fileName;
        }

        public async Task<Stream> OpenReadAsync(string containerName, string fileName)
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            if (!await blobClient.ExistsAsync())
                throw new FileNotFoundException();

            return await blobClient.OpenReadAsync();
        }

        public async Task DeleteFileAsync(string containerName, string fileName)
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            await blobClient.DeleteIfExistsAsync();
        }

        public async Task DeleteFilesAsync(string containerName, IEnumerable<string> fileNames)
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            var deleteTasks = fileNames.Select(async fileName =>
            {
                var blobClient = containerClient.GetBlobClient(fileName);

                var response = await blobClient.DeleteIfExistsAsync();

                return new
                {
                    FileName = fileName,
                    Deleted = response.Value
                };
            });

            var results = await Task.WhenAll(deleteTasks);

            foreach (var result in results)
            {
                if (result.Deleted)
                    Console.WriteLine($"Deleted: {result.FileName}");
                else
                    Console.WriteLine($"Not found: {result.FileName}");
            }
        }

        public string ComputeFileHash(IFormFile file)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            using var stream = file.OpenReadStream();
            var hashBytes = sha256.ComputeHash(stream);
            return Convert.ToBase64String(hashBytes);
        }
    }
}
