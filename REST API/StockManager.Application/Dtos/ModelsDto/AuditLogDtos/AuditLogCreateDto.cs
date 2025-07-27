using System;

namespace StockManager.Application.Dtos.ModelsDto.AuditLogDtos;

public sealed record AuditLogCreateDto
{
    public string EntityName { get; init; }
    public int EntityId { get; init; }
    public string Action { get; init; }
    public string ChangedById { get; init; }
    public string Changes { get; init; }
}

