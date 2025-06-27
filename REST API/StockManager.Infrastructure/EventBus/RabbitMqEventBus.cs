using System;
using System.Globalization;
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

    public RabbitMqEventBus(IConnection connection, IOptions<RabbitMqSettings> opts)
    {
        _connection = connection;
        _settings = opts.Value;

        NullCheck.IsConfigured(_settings);
        
        _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();
        _channel.ExchangeDeclareAsync(opts.Value.Exchange, ExchangeType.Topic, durable: true)
            .GetAwaiter()
            .GetResult();
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
