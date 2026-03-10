using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Infrastructure.Persistence.Data;
using TestHelpers.TestHelpers.Auth;

namespace TestHelpers.Fixture;

public sealed class WebApplicationTestFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Test");

        builder.ConfigureTestServices(services =>
        {
            services.AddScoped<IBaseRepository, TestBaseRepository>();

            // redis
            ServiceDescriptor? redis = services.SingleOrDefault(
                d => d.ServiceType == typeof(IConnectionMultiplexer));

            if (redis != null)
            {
                services.Remove(redis);
            }

            services.AddSingleton<IConnectionMultiplexer>(_ =>
                ConnectionMultiplexer.Connect("localhost:6379,abortConnect=false"));

            // cache
            ServiceDescriptor? cache = services.SingleOrDefault(
                d => d.ServiceType == typeof(IDistributedCache));

            if (cache != null)
            {
                services.Remove(cache);
            }
            services.AddDistributedMemoryCache();

            // sqlite
            ServiceDescriptor? descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<StockManagerDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<StockManagerDbContext>(options =>
                options.UseInMemoryDatabase("TestDb"));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "Test";
                options.DefaultChallengeScheme = "Test";
            })
            .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                "Test", options => { });
                    });
    }
}
