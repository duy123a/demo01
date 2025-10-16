dotnet ef migrations add <name> --project Demo01.Infrastructure

dotnet ef migrations remove --project Demo01.Infrastructure

dotnet ef database update --project Demo01.Infrastructure

dotnet ef database update 0 --project Demo01.Infrastructure

dotnet ef database drop --project Demo01.Infrastructure

dotnet publish -c Release

DOTNET_URLS="https://localhost:7225;http://localhost:5019" dotnet Demo01.WebApi.dll

dotnet tool update --global dotnet-ef