using System.ComponentModel;
using Azure.Identity;
using FluentAssertions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;

namespace StockManager.Tests.IntegrationTests.Azure;

/* Assumptions:
 * You must be logged in azure, for instance 'az login' in azure cli shell
 * Yoour account has KV role -> Key Vault Secrets Officer OR Key Vault Administrator
 * There are secrets: jwt-key ; jwt-issuer ; jwt-audience 
*/

[Category("IntegrationTests")]
public sealed class AzureKeyVaultTests
{
    private static WebApplicationBuilder CreateBuilderWithKeyVault()
    {
        Environment.SetEnvironmentVariable("KEYVAULT_URI", "https://stockmanager-keyvault.vault.azure.net/");

        string? kvUri = Environment.GetEnvironmentVariable("KEYVAULT_URI");
        ArgumentException.ThrowIfNullOrWhiteSpace(kvUri, nameof(kvUri));

        WebApplicationBuilder builder = WebApplication.CreateBuilder();

        builder.Configuration.AddAzureKeyVault(
            new Uri(kvUri), new DefaultAzureCredential());

        return builder;
    }

    [Fact]
    public void Should_Return_Issuer_And_Audience_From_Azure_Key_Vault()
    {
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
        // Act
        WebApplicationBuilder builder = CreateBuilderWithKeyVault();

        // Arrange
        string? signingKey = builder.Configuration["jwt-key"];

        // Assert
        signingKey.Should().NotBeNullOrWhiteSpace();
        signingKey.Length.Should().BeGreaterThanOrEqualTo(32, "the JWT key should be strong enough");
    }
}
