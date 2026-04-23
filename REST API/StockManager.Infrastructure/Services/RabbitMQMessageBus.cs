using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Infrastructure.Services;

public class RabbitMQMessageBus : IMessageBus, IDisposable
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<RabbitMQMessageBus> _logger;
    private IConnection? _connection;
    private IChannel? _channel;
    private readonly SemaphoreSlim _initLock = new(1, 1);
    private bool _initialized;

    private const int MaxRetries = 3;
    private static readonly TimeSpan RetryDelay = TimeSpan.FromSeconds(2);

    public RabbitMQMessageBus(IConfiguration configuration, ILogger<RabbitMQMessageBus> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    private async Task EnsureConnectedAsync()
    {
        if (_initialized && _connection?.IsOpen == true && _channel?.IsOpen == true)
            return;

        await _initLock.WaitAsync();
        try
        {
            if (_initialized && _connection?.IsOpen == true && _channel?.IsOpen == true)
                return;

            var factory = new ConnectionFactory()
            {
                HostName = _configuration["RabbitMQ:Host"] ?? "localhost",
                UserName = _configuration["RabbitMQ:Username"] ?? "guest",
                Password = _configuration["RabbitMQ:Password"] ?? "guest"
            };

            for (int attempt = 1; attempt <= MaxRetries; attempt++)
            {
                try
                {
                    _connection = await factory.CreateConnectionAsync();
                    _channel = await _connection.CreateChannelAsync();
                    _initialized = true;
                    _logger.LogInformation("RabbitMQ connected successfully on attempt {Attempt}", attempt);
                    return;
                }
                catch (Exception ex) when (attempt < MaxRetries)
                {
                    _logger.LogWarning(ex, "RabbitMQ connection attempt {Attempt}/{MaxRetries} failed, retrying in {Delay}s...",
                        attempt, MaxRetries, RetryDelay.TotalSeconds);
                    await Task.Delay(RetryDelay);
                }
            }

            // Last attempt — let the exception propagate
            _connection = await factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();
            _initialized = true;
        }
        finally
        {
            _initLock.Release();
        }
    }

    public async Task PublishAsync<T>(T message, string queueName) where T : class
    {
        await EnsureConnectedAsync();

        await _channel!.QueueDeclareAsync(queue: queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);

        var json = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(json);

        await _channel.BasicPublishAsync(exchange: string.Empty, routingKey: queueName, body: body);
    }

    public async Task SubscribeAsync<T>(string queueName, Func<T, Task> onMessageReceived) where T : class
    {
        await EnsureConnectedAsync();

        await _channel!.QueueDeclareAsync(queue: queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);

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

            await _channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
        };

        await _channel.BasicConsumeAsync(queue: queueName, autoAck: false, consumer: consumer);
    }

    public void Dispose()
    {
        if (_channel?.IsOpen == true)
            _channel.CloseAsync().GetAwaiter().GetResult();
        if (_connection?.IsOpen == true)
            _connection.CloseAsync().GetAwaiter().GetResult();
    }
}
