using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using StockManager.Application.Common.Events;

namespace StockManager.Application.Common.Events.StockTransaction;

public sealed record StockTransactionCreatedIntegrationEvent(StockTransactionDto StockTransaction) : IIntegrationEvent;
