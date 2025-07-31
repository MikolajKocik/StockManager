namespace StockManager.Application.Common.Events.StockTransaction;

public sealed record StockTransactionUpdatedIntegrationEvent(int StockTransactionIdn) : IIntegrationEvent;
