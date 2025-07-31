namespace StockManager.Application.Common.Events.StockTransaction;

public sealed record StockTransactionDeletedIntegrationEvent(int StockTransactionId) : IIntegrationEvent;
