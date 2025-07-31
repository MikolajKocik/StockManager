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

namespace StockManager.Application.Tests.IntegrationTests.Docker.SqlContainer;
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
