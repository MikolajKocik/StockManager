using System;
using StockManager.Application.Common.Events;

namespace StockManager.Application.Common.Events.InventoryItem;

public sealed record InventoryItemDeletedIntegrationEvent(
    int InventoryItemId)
    : IIntegrationEvent;

