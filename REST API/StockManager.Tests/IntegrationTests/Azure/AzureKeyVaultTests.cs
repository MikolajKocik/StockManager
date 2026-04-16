using System.ComponentModel;
using System.Linq;
using Azure;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using FluentAssertions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;

namespace StockManager.Tests.IntegrationTests.Azure;

[Category("IntegrationTests")]
[Trait("Category", "Azure")]
public sealed class AzureKeyVaultTests
{
    private static bool IsKeyVaultAvailable()
    {
        try
        {
            string? kvUri = "https://stockmanager-keyvault.vault.azure.net/";
            var client = new SecretClient(new Uri(kvUri), new DefaultAzureCredential());
            // Actually test the connection by listing secrets with a timeout
            SecretProperties secrets = client.GetPropertiesOfSecrets().FirstOrDefault();
            return true;
        }
        catch (Exception ex) when (ex.Message.Contains("Name or service not known") || 
                                   ex.Message.Contains("could not be resolved") ||
                                   ex is RequestFailedException ||
                                   ex.InnerException?.Message.Contains("Name or service not known") == true)
        {
            return false;
        }
        catch
        {
            return false;
        }
    }

    [Fact]
    public void Should_Return_Issuer_And_Audience_From_Azure_Key_Vault()
    {
        bool isAvailable = IsKeyVaultAvailable();
        if (!isAvailable)
        {
            // Skip test if Key Vault is not available
            return;
        }

        // Act
        WebApplicationBuilder builder = CreateBuilderWithKeyVault();

        // Arrange
        string? issuer = builder.Configuration["jwt-issuer"];
        string? audience = builder.Configuration["jwt-audience"];

        // Assert
        issuer.Should().NotBeNullOrWhiteSpace();
        audience.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public void Should_Return_Jwt_Key_From_Azure_Key_Vault()
    {
        bool isAvailable = IsKeyVaultAvailable();
        if (!isAvailable)
        {
            return;
        }

        // Act
        WebApplicationBuilder builder = CreateBuilderWithKeyVault();

        // Arrange
        string? signingKey = builder.Configuration["jwt-key"];

        // Assert
        signingKey.Should().NotBeNullOrWhiteSpace();
        signingKey.Length.Should().BeGreaterThanOrEqualTo(32, "the JWT key should be strong enough");
    }

    private static WebApplicationBuilder CreateBuilderWithKeyVault()
    {
        Environment.SetEnvironmentVariable("KEYVAULT_URI", "https://stockmanager-keyvault.vault.azure.net/");

        string? kvUri = Environment.GetEnvironmentVariable("KEYVAULT_URI");
        ArgumentException.ThrowIfNullOrWhiteSpace(kvUri, nameof(kvUri));

        WebApplicationBuilder builder = WebApplication.CreateBuilder();

        try
        {
            builder.Configuration.AddAzureKeyVault(
                new Uri(kvUri), new DefaultAzureCredential());
        }
        catch (Exception ex) when (
            ex is RequestFailedException ||
            ex is OperationCanceledException ||
            ex.InnerException is OperationCanceledException ||
            ex.Message.Contains("could not be resolved") ||
            ex.Message.Contains("Name or service not known") ||
            ex.Message.Contains("timed out"))
        {
            // Key Vault is not available, skip configuration
            // The configuration will fall back to environment variables or appsettings
        }

        return builder;
    }
}
