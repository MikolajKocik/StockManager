namespace StockManager.Core.Domain.Interfaces.Services;

public interface IMessageBus
{
    Task PublishAsync<T>(T message, string queueName, CancellationToken cancellationToken) where T : class;
    Task SubscribeAsync<T>(string queueName, Func<T, Task> onMessageReceived, CancellationToken cancellationToken) where T : class;
}
