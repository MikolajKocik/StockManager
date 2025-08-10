using System;

namespace StockManager.Application.Dtos.ModelsDto.AuditLogDtos;

public sealed record AuditLogCreateDto
{
    public required string EntityName { get; init; }
    public int EntityId { get; init; }
    public required string Action { get; init; }
    public required string ChangedById { get; init; }
    public required string Changes { get; init; }
}

