using System.Globalization;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using StockManager.Application.Common.Events;
using StockManager.Infrastructure.EventBus;
using StockManager.Infrastructure.Settings;

namespace StockManager.Extensions.WebAppBuilderExtensions.RabbitMQ;

internal static class RabbitMqConfiguration
{
    public static void AddRabbitMqConfiguration(WebApplicationBuilder builder)
    {
        CultureInfo format = CultureInfo.InvariantCulture;
        builder.Services.Configure<RabbitMqSettings>(opts =>
        {
            opts.HostName = Environment.GetEnvironmentVariable("RABBITMQ_HOST")!;
            opts.Port = Convert.ToInt32(Environment.GetEnvironmentVariable("RABBITMQ_PORT")!, format);
            opts.UserName = Environment.GetEnvironmentVariable("RABBITMQ_USER")!;
            opts.Password = Environment.GetEnvironmentVariable("RABBITMQ_PASS")!;
            opts.Exchange = Environment.GetEnvironmentVariable("RABBITMQ_EXCHANGE") ?? "stock-exchange";
        });

        builder.Services.AddSingleton<IEventBus, RabbitMqEventBus>();
    }
}
