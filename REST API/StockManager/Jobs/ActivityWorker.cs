using Microsoft.AspNetCore.SignalR;
using StockManager.Core.Domain.Events;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Hubs;

namespace StockManager.Jobs;

public sealed class ActivityWorker : BackgroundService
{
    private readonly IMessageBus _messageBus;
    private readonly IHubContext<ActivityHub> _hubContext;
    private readonly ILogger<ActivityWorker> _logger;

    public ActivityWorker(
        IMessageBus messageBus,
        IHubContext<ActivityHub> hubContext,
        ILogger<ActivityWorker> logger)
    {
        _messageBus = messageBus;
        _hubContext = hubContext;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ActivityWorker starting and subscribing to activities-queue...");

        await _messageBus.SubscribeAsync<ActivityMessage>(
            queueName: "activities-queue",
            onMessageReceived: async (message) =>
            {
                _logger.LogInformation("Received activity message from broker: {Title}", message.Title);
                await _hubContext.Clients.All.SendAsync("ReceiveActivity", message, stoppingToken);
            },
            stoppingToken
        );
    }
}
