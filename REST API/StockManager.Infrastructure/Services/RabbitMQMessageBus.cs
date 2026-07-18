using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Infrastructure.Services;

public sealed class RabbitMQMessageBus(
    IConfiguration configuration,
    ILogger<RabbitMQMessageBus> logger) : IMessageBus, IAsyncDisposable
{
    private readonly IConfiguration _configuration = configuration;
    private readonly ILogger<RabbitMQMessageBus> _logger = logger;
    private IConnection? _connection;
    private IChannel? _publishChannel;
    private readonly List<IChannel> _consumeChannels = new();
    private readonly SemaphoreSlim _initLock = new(1, 1);
    private readonly SemaphoreSlim _publishLock = new(1, 1);
    private bool _initialized;

    private const int MaxRetries = 3;
    private static readonly TimeSpan RetryDelay = TimeSpan.FromSeconds(2);

    private async Task EnsureConnectedAsync(CancellationToken ct)
    {
        if (_initialized && _connection?.IsOpen is true && _publishChannel?.IsOpen is true)
        {
            return;
        }

        await _initLock.WaitAsync(ct);
        try
        {
            if (_initialized && _connection?.IsOpen is true && _publishChannel?.IsOpen is true)
            {
                return;
            }

            var factory = new ConnectionFactory()
            {
                HostName = _configuration["RabbitMQ:Host"] ?? "localhost",
                UserName = _configuration["RabbitMQ:Username"] ?? "guest",
                Password = _configuration["RabbitMQ:Password"] ?? "guest"
            };

            Exception? lastException = null;

            for (int attempt = 1; attempt <= MaxRetries; attempt++)
            {
                try
                {
                    _connection = await factory.CreateConnectionAsync(ct);
                    _publishChannel = await _connection.CreateChannelAsync(cancellationToken: ct);
                    _initialized = true;
                    _logger.LogInformation("RabbitMQ connected successfully on attempt {Attempt}", attempt);
                    return;
                }
                catch (Exception ex)
                {
                    lastException = ex;
                    if (attempt < MaxRetries)
                    {
                        _logger.LogWarning(ex, "RabbitMQ connection attempt {Attempt}/{MaxRetries} failed, retrying in {Delay}s...",
                            attempt, MaxRetries, RetryDelay.TotalSeconds);
                        await Task.Delay(RetryDelay, ct);
                    }
                }
            }

            throw new InvalidOperationException("Failed to connect to RabbitMQ after all retries.", lastException);
        }
        finally
        {
            _initLock.Release();
        }
    }

    private async Task DeclareDlxQueueAsync(IChannel channel, string queueName, CancellationToken ct)
    {
        await channel!.BasicQosAsync(prefetchSize: 0, prefetchCount: 10, global: false, cancellationToken: ct);

        string dlxName = $"{queueName}-dlx";
        string errorQueueName = $"{queueName}-error";

        await channel!.ExchangeDeclareAsync(
            exchange: dlxName,
            type: ExchangeType.Direct,
            cancellationToken: ct
        );
        await channel.QueueDeclareAsync(
            queue: errorQueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null,
            cancellationToken: ct
        );
        await channel.QueueBindAsync(
            queue: errorQueueName,
            exchange: dlxName,
            routingKey: queueName,
            cancellationToken: ct
        );

        var arguments = new Dictionary<string, object>
        {
            { "x-dead-letter-exchange", dlxName },
            { "x-dead-letter-routing-key", queueName }
        };

        await channel.QueueDeclareAsync(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: arguments!,
            cancellationToken: ct
        );
    }

    public async Task PublishAsync<T>(T message, string queueName, CancellationToken ct) where T : class
    {
        await EnsureConnectedAsync(ct);

        await _publishLock.WaitAsync(ct);
        try
        {
             await DeclareDlxQueueAsync(_publishChannel!, queueName, ct);

            string json = JsonSerializer.Serialize(message);
            byte[] body = Encoding.UTF8.GetBytes(json);

            var properties = new BasicProperties
            {
                Persistent = true
            };

            await _publishChannel!.BasicPublishAsync(
                exchange: string.Empty,
                routingKey: queueName,
                mandatory: false,
                basicProperties: properties,
                body: body,
                cancellationToken: ct);
        }
        finally
        {
            _publishLock.Release();
        }
    }

    public async Task SubscribeAsync<T>(string queueName, Func<T, Task> onMessageReceived, CancellationToken ct) where T : class
    {
        await EnsureConnectedAsync(ct);

        IChannel consumeChannel = await _connection!.CreateChannelAsync(cancellationToken: ct);
        _consumeChannels.Add(consumeChannel);

        await DeclareDlxQueueAsync(consumeChannel, queueName, ct);
        await consumeChannel.BasicQosAsync(prefetchSize: 0, prefetchCount: 10, global: false, cancellationToken: ct);


        var consumer = new AsyncEventingBasicConsumer(consumeChannel);
        consumer.ReceivedAsync += async (_, ea) =>
        {
            try
            {
                byte[] body = ea.Body.ToArray();
                string json = Encoding.UTF8.GetString(body);
                T message = JsonSerializer.Deserialize<T>(json);

                if (message is not null)
                {
                    await onMessageReceived(message);
                }

                await consumeChannel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process message from {Queue}", queueName);
                await consumeChannel.BasicNackAsync(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
            }
        };

        await consumeChannel!.BasicConsumeAsync(
            queue: queueName,
            autoAck: false,
            consumer: consumer,
            cancellationToken: ct);
    }

    public async ValueTask DisposeAsync()
    {
        foreach (IChannel channel in _consumeChannels)
        {
            if (channel.IsOpen)
            {
                await channel.CloseAsync();
            }
            await channel.DisposeAsync();
        }

        if (_publishChannel?.IsOpen is true)
        {
            await _publishChannel.CloseAsync();
        }
        if (_publishChannel is not null)
        {
            await _publishChannel.DisposeAsync();
        }

        if (_connection?.IsOpen is true)
        {
            await _connection.CloseAsync();
        }
        if (_connection is not null)
        {
            await _connection.DisposeAsync();
        }

        _publishLock.Dispose();
        _initLock.Dispose();
    }
}
