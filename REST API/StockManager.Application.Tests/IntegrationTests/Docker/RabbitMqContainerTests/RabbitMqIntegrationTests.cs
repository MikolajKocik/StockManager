using System.Threading.Tasks;
using DotNet.Testcontainers.Containers;
using FluentAssertions;
using RabbitMQ.Client;
using Testcontainers.RabbitMq;

namespace StockManager.Application.Tests.IntegrationTests.Docker.RabbitMqContainerTests;

public sealed class RabbitMqIntegrationTests : IAsyncLifetime, IAsyncDisposable
{
    private readonly RabbitMqContainer _rabbitMqContainer =
        new RabbitMqBuilder()
            .WithUsername(Environment.GetEnvironmentVariable("RABBITMQ_USER") ?? "guest")
            .WithPassword(Environment.GetEnvironmentVariable("RABBITMQ_PASS") ?? "guest")
            .Build();

    public async ValueTask InitializeAsync()
    {
        await _rabbitMqContainer.StartAsync()
            .ConfigureAwait(false);
    }

    public ValueTask DisposeAsync()
    {
        return _rabbitMqContainer.DisposeAsync();
    }

    [Fact]
    public async Task IsOpenReturnsTrue()
    {
        //
        using var cancellationToken = new CancellationTokenSource(TimeSpan.FromSeconds(10));

        var connectionFactory = new ConnectionFactory
        {
            Uri = new Uri(_rabbitMqContainer.GetConnectionString())
        };

        //
        using IConnection connection = await connectionFactory.CreateConnectionAsync(cancellationToken.Token);

        //
        connection.IsOpen.Should().BeTrue();
    }
}
