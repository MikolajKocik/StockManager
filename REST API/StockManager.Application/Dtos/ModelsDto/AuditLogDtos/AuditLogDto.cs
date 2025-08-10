using System;

namespace StockManager.Application.Dtos.ModelsDto.AuditLogDtos;

public sealed record AuditLogDto
{
    public int Id { get; init; }
    public required string EntityName { get; init; }
    public int EntityId { get; init; }
    public required string Action { get; init; }
    public DateTime Timestamp { get; init; }
    public required string Changes { get; init; }
    public required string ChangedById { get; init; }
    public string? ChangedByUserName { get; init; }
}

