using System.ComponentModel;
using DotNet.Testcontainers.Containers;
using FluentAssertions;
using StackExchange.Redis;
using Testcontainers.Redis;

namespace StockManager.Application.Tests.IntegrationTests.Docker.RedisContainerTests;

[Category("IntegrationTests")]
public sealed class RedisIntegrationTests : IAsyncLifetime
{
    private readonly RedisContainer _redisContainer = new RedisBuilder().Build();

    public async Task DisposeAsync()
    {
        await _redisContainer.DisposeAsync();
    }

    public async Task InitializeAsync()
    {
        await _redisContainer.StartAsync();
    }

    /// <summary>
    /// Verifies that a connection to the Redis server can be established and that the connection state is open.
    /// </summary>
    /// <remarks>This test ensures that the Redis connection is successfully created and is in a connected
    /// state.</remarks>
    [Fact]
    public void ConnectionState_Returns_Open()
    {
        //
        using var connection = ConnectionMultiplexer.Connect(_redisContainer.GetConnectionString());

        //
        connection.Should().NotBeNull();
        connection.IsConnected.Should().BeTrue();
    }


    /// <summary>
    /// Executes a Lua script on the Redis container and verifies that the execution is successful.
    /// </summary>
    /// <remarks>This test method ensures that the script execution returns an exit code of 0, the expected
    /// output in the standard output stream, and no errors in the standard error stream. It validates the behavior of
    /// the <see cref="_redisContainer.ExecScriptAsync"/> method.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task ExecScript_Returns_Successful()
    {
        //
        const string scriptContent = "return 'Hello, scripting!'";

        //
        ExecResult execResult = await _redisContainer.ExecScriptAsync(scriptContent, CancellationToken.None)
            .ConfigureAwait(true);

        bool exitCode = 0L.Equals(execResult.ExitCode);
        bool scriptConfig = "Hello, scripting!\n".Equals(execResult.Stdout);
        string resultEmtpy = execResult.Stderr;

        //
        exitCode.Should().BeTrue(execResult.Stderr);
        scriptConfig.Should().BeTrue(execResult.Stdout);
        resultEmtpy.Should().BeEmpty();
    }
}
