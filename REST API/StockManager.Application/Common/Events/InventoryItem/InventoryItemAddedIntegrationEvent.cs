using System;
using StockManager.Application.Common.Events;

namespace StockManager.Application.Common.Events.InventoryItem;

public sealed record InventoryItemAddedIntegrationEvent(
    int InventoryItemId,
    int ProductId,
    string? ProductName, 
    int BinLocationId,
    CancellationToken cancellationToken = default
    ) : IIntegrationEvent;

