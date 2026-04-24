using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Infrastructure.Services;

public sealed class RabbitMQMessageBus : IMessageBus, IAsyncDisposable
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

    private async Task EnsureConnectedAsync(CancellationToken cancellationToken)
    {
        if (_initialized && _connection?.IsOpen == true && _channel?.IsOpen == true)
        {
            return;
        }

        await _initLock.WaitAsync(cancellationToken);
        try
        {
            if (_initialized && _connection?.IsOpen == true && _channel?.IsOpen == true)
            {
                return;
            }

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
                    _connection = await factory.CreateConnectionAsync(cancellationToken);
                    _channel = await _connection.CreateChannelAsync(cancellationToken: cancellationToken);
                    _initialized = true;
                    _logger.LogInformation("RabbitMQ connected successfully on attempt {Attempt}", attempt);
                    return;
                }
                catch (Exception ex) when (attempt < MaxRetries)
                {
                    _logger.LogWarning(ex, "RabbitMQ connection attempt {Attempt}/{MaxRetries} failed, retrying in {Delay}s...",
                        attempt, MaxRetries, RetryDelay.TotalSeconds);
                    await Task.Delay(RetryDelay, cancellationToken);
                }
            }

            // Last attempt — let the exception propagate
            _connection = await factory.CreateConnectionAsync(cancellationToken);
            _channel = await _connection.CreateChannelAsync(cancellationToken: cancellationToken);
            _initialized = true;
        }
        finally
        {
            _initLock.Release();
        }
    }


    private async Task DeclareDlxQueueAsync(string queueName, CancellationToken cancellationToken)
    {
        await _channel!.BasicQosAsync(prefetchSize: 0, prefetchCount: 10, global: false, cancellationToken: cancellationToken);

        string dlxName = $"{queueName}-dlx";
        string errorQueueName = $"{queueName}-error";

        await _channel!.ExchangeDeclareAsync(
            exchange: dlxName,
            type: ExchangeType.Direct,
            cancellationToken: cancellationToken
        );
        await _channel.QueueDeclareAsync(
            queue: errorQueueName,
            durable: true, 
            exclusive: false, 
            autoDelete: false, 
            arguments: null,
            cancellationToken: cancellationToken
        );
        await _channel.QueueBindAsync(
            queue: errorQueueName, 
            exchange: dlxName, 
            routingKey: queueName,
            cancellationToken: cancellationToken
        );

        var arguments = new Dictionary<string, object>
        {
            { "x-dead-letter-exchange", dlxName },
            { "x-dead-letter-routing-key", queueName }
        };

        await _channel.QueueDeclareAsync(
            queue: queueName, 
            durable: true, 
            exclusive: false, 
            autoDelete: false, 
            arguments: arguments!,
            cancellationToken: cancellationToken
        );
    }

    public async Task PublishAsync<T>(T message, string queueName, CancellationToken cancellationToken) where T : class
    {
        await EnsureConnectedAsync(cancellationToken);

        await DeclareDlxQueueAsync(queueName, cancellationToken);

        string json = JsonSerializer.Serialize(message);
        byte[] body = Encoding.UTF8.GetBytes(json);

        var properties = new BasicProperties
        {
            Persistent = true
        };

        await _channel!.BasicPublishAsync(
            exchange: string.Empty, 
            routingKey: queueName, 
            body: body, 
            mandatory:false, 
            basicProperties: properties,
            cancellationToken: cancellationToken);
    }

    public async Task SubscribeAsync<T>(string queueName, Func<T, Task> onMessageReceived, CancellationToken cancellationToken) where T : class
    {
        await EnsureConnectedAsync(cancellationToken);

        await DeclareDlxQueueAsync(queueName, cancellationToken);

        var consumer = new AsyncEventingBasicConsumer(_channel!);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            try
            {
                byte[] body = ea.Body.ToArray();
                string json = Encoding.UTF8.GetString(body);
                T message = JsonSerializer.Deserialize<T>(json);

                if (message != null)
                {
                    await onMessageReceived(message);
                }

                await _channel!.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
            }
            catch (Exception)
            {
                await _channel!.BasicNackAsync(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
            }
        };

        await _channel!.BasicConsumeAsync(
            queue: queueName, 
            autoAck: false, 
            consumer: consumer,
            cancellationToken: cancellationToken);
    }

    public async ValueTask DisposeAsync()
    {
        if (_channel?.IsOpen == true)
        {
            await _channel.CloseAsync();
            await _channel.DisposeAsync();
        }
        if (_connection?.IsOpen == true)
        {
            await _connection.CloseAsync();
            await _connection.DisposeAsync();
        }
    }
}
