namespace StockManager.Core.Domain.Interfaces.Services;

public interface IMessageBus
{
    Task PublishAsync<T>(T message, string queueName) where T : class;
    void Subscribe<T>(string queueName, Func<T, Task> onMessageReceived) where T : class;
}
