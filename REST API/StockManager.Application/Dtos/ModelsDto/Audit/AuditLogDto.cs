using System;

namespace StockManager.Application.Dtos.ModelsDto.Audit;

public sealed record AuditLogDto
{
    public int Id { get; }
    public string EntityName { get; }
    public int EntityId { get; }
    public string Action { get; }
    public DateTime Timestamp { get; }
    public string Changes { get; }
    public string ChangedById { get; }
    public string? ChangedByUserName { get; }
}

