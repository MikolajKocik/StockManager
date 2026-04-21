using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Infrastructure.Services;

public class RabbitMQMessageBus : IMessageBus, IDisposable
{
    private readonly IConnection _connection;
    private readonly IChannel _channel;

    public RabbitMQMessageBus(IConfiguration configuration)
    {
        var factory = new ConnectionFactory()
        {
            HostName = configuration["RabbitMQ:HostName"] ?? "localhost",
            UserName = configuration["RabbitMQ:UserName"] ?? "guest",
            Password = configuration["RabbitMQ:Password"] ?? "guest"
        };

        _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
        _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();
    }

    public async Task PublishAsync<T>(T message, string queueName) where T : class
    {
        await _channel.QueueDeclareAsync(queue = queueName, durable = true, exclusive = false, autoDelete = false, arguments = null);

        var json = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(json);

        await _channel.BasicPublishAsync(exchange = string.Empty, routingKey = queueName, body = body);
    }

    public void Subscribe<T>(string queueName, Func<T, Task> onMessageReceived) where T : class
    {
        _channel.QueueDeclareAsync(queue = queueName, durable = true, exclusive = false, autoDelete = false, arguments = null).GetAwaiter().GetResult();

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var json = Encoding.UTF8.GetString(body);
            var message = JsonSerializer.Deserialize<T>(json);

            if (message != null)
            {
                await onMessageReceived(message);
            }

            await _channel.BasicAckAsync(deliveryTag = ea.DeliveryTag, multiple = false);
        };

        _channel.BasicConsumeAsync(queue = queueName, autoAck = false, consumer = consumer).GetAwaiter().GetResult();
    }

    public void Dispose()
    {
        if (_channel.IsOpen)
            _channel.CloseAsync().GetAwaiter().GetResult();
        if (_connection.IsOpen)
            _connection.CloseAsync().GetAwaiter().GetResult();
    }
}
