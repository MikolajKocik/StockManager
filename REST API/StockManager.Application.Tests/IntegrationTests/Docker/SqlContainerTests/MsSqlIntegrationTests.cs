using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DotNet.Testcontainers.Builders;
using FluentAssertions;
using Microsoft.Data.SqlClient;
using Testcontainers.MsSql;
using Xunit.Sdk;

namespace StockManager.Application.Tests.IntegrationTests.Docker.SqlContainerTests;
public sealed class MsSqlIntegrationTests : IAsyncLifetime
{
    private readonly MsSqlContainer _db = new MsSqlBuilder().Build();

    public async ValueTask InitializeAsync()
    {
        await _db.StartAsync();
    }

    public ValueTask DisposeAsync()
    {
        return _db.DisposeAsync();
    }

    /// <summary>
    /// Verifies that the connection state of a <see cref="SqlConnection"/> is <see cref="ConnectionState.Open"/> after
    /// opening the connection.
    /// </summary>
    /// <remarks>This test ensures that a <see cref="SqlConnection"/> transitions to the <see
    /// cref="ConnectionState.Open"/> state  after calling <see cref="SqlConnection.OpenAsync(CancellationToken)"/> with
    /// a valid connection string.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task ConnectionStateReturnsOpen()
    {
        //
        using var cancellationToken = new CancellationTokenSource(TimeSpan.FromSeconds(10));

        await using var conn = new SqlConnection(_db.GetConnectionString());
        await conn.OpenAsync(cancellationToken.Token);

        //
        bool result = Equals(ConnectionState.Open, conn.State);

        //
        result.Should().BeTrue();
    }

    /// <summary>
    /// Verifies that a SQL query returning a scalar value executes successfully and returns the expected result.
    /// </summary>
    /// <remarks>This test method connects to the database, executes a simple SQL query ("SELECT 1"), and
    /// asserts that the result is the integer value 1. It uses a cancellation token with a 10-second timeout to ensure
    /// the operation does not hang indefinitely.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task SelectOne_Works()
    {
        //
        using var cancellationToken = new CancellationTokenSource(TimeSpan.FromSeconds(10));

        await using var conn = new SqlConnection(_db.GetConnectionString());
        await conn.OpenAsync(cancellationToken.Token);

        await using SqlCommand cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT 1";

        IFormatProvider format = default;
        //
        object? scalar = await cmd.ExecuteScalarAsync(cancellationToken.Token);

        //
        Convert.ToInt32(scalar, format).Should().Be(1);
    }
}
