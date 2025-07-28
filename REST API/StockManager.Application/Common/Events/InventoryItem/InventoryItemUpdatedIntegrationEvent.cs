using System;
using StockManager.Application.Common.Events;

namespace StockManager.Application.Common.Events.InventoryItem;

public sealed record InventoryItemUpdatedIntegrationEvent(
    int InventoryItemId, 
    int ProductId,
    string? ProductName, 
    int BinLocationId)
    : IIntegrationEvent;

