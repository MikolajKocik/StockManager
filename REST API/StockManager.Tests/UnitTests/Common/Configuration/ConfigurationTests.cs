using Azure.Identity;
using FluentAssertions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using TestHelpers.Fixture;

namespace StockManager.Tests.UnitTests.Common.Configuration;

public sealed class ConfigurationTests : IClassFixture<WebAppBuilderFixture>
{
    private readonly WebAppBuilderFixture _fixture;

    public ConfigurationTests(WebAppBuilderFixture fixture)
        => _fixture = fixture;

    private void AddResources()
    {
        _fixture.Builder.Configuration.AddInMemoryCollection(
            new Dictionary<string, string?>
            {
                ["jwt-key"] = "test-key",
                ["otel-log-level"] = "debug"
            });
    }

    [Fact]
    public void Should_Return_Variables_From_Configuration()    
    {
        // Act
        AddResources();
        string otelLogLevel = "debug";

        // Arrange
        string? variable = _fixture.Builder.Configuration["otel-log-level"];

        // Assert
        variable.Should().Be(otelLogLevel);
    }

    [Fact]
    public void Should_Not_Be_Null_Result()
    {
        // Act
        AddResources();

        // Arrange
        string? key = _fixture.Builder.Configuration["jwt-key"];

        // Assert
        key.Should().NotBeNullOrEmpty();
    }
}
