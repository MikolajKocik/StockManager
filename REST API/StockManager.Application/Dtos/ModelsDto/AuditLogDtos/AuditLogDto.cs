using System;

namespace StockManager.Application.Dtos.ModelsDto.AuditLogDtos;

public sealed record AuditLogDto
{
    public int Id { get; init; }
    public string EntityName { get; init; }
    public int EntityId { get; init; }
    public string Action { get; init; }
    public DateTime Timestamp { get; init; }
    public string Changes { get; init; }
    public string ChangedById { get; init; }
    public string? ChangedByUserName { get; init; }
}

