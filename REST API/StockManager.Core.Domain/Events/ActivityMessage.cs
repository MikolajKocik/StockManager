namespace StockManager.Core.Domain.Events;

public record ActivityMessage(
    string Title,
    string Description,
    string Category,
    string Type,
    DateTime Timestamp,
    string? User
);
