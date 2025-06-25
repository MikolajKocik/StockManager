using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using StockManager.Application.Common.Events;
using StockManager.Application.Helpers.NullConfiguration;
using StockManager.Infrastructure.Settings;

namespace StockManager.Infrastructure.EventBus;

public class RabbitMqEventBus : IEventBus, IAsyncDisposable
{
    private readonly IConnection _connection;
    private readonly IChannel _channel;
    private readonly RabbitMqSettings _settings;
    private readonly IFormatProvider _format;

    public RabbitMqEventBus(IOptions<RabbitMqSettings> opts)
    {
        _settings = opts.Value;
        var factory = new ConnectionFactory
        {
            HostName = Environment.GetEnvironmentVariable("RABBITMQ_HOST")!,
            Port = Convert.ToInt32(Environment.GetEnvironmentVariable("RABBITMQ_PORT"), _format)!,
            UserName = _settings.UserName,
            Password = _settings.Password,
        };
        NullCheck.IsConfigured(factory.HostName, factory.Port);

        _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult(); 
        _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();
        _channel.ExchangeDeclareAsync(_settings.Exchange, ExchangeType.Topic, durable: true);
    }

    public async Task PublishAsync<TEvent>(TEvent @event) where TEvent : IIntegrationEvent
    {
        string routingKey = @event.GetType().Name;
        byte[] body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(@event));
        var props = new BasicProperties();

        await _channel.BasicPublishAsync(_settings.Exchange, routingKey, false, props, body);
    }

    public async ValueTask DisposeAsync()
    {
        if (_channel is not null)
        {
            await _channel.CloseAsync();
        }

        if (_connection is not null)
        {
            await _connection.CloseAsync();
        }
    }
}
