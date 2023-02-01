FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /TimeManagementApp

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
RUN dotnet dev-certs https
WORKDIR /src

EXPOSE 5100
EXPOSE 80

# COPY all the layers CSPROJ 
COPY time-management-API.csproj .

# RUN restore over API project - this pulls restore over the dependent projects as well
RUN dotnet restore ./time-management-API.csproj
COPY . .

# run build over the API project
WORKDIR "/src/"
RUN dotnet build -c Release -o /app/build

# run publish over the API project
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS runtime
WORKDIR /TimeManagementApp

COPY --from=publish /root/.dotnet/corefx/cryptography/x509stores/my/* /root/.dotnet/corefx/cryptography/x509stores/my/
COPY --from=publish /app/publish .

RUN ls -l
ENTRYPOINT [ "dotnet", "time-management-API.dll" ]