using System;

namespace StockManager.Application.Dtos.ModelsDto.Audit;

public sealed record AuditLogCreateDto
{
    public string EntityName { get; init; }
    public int EntityId { get; init; }
    public string Action { get; init; }
    public string ChangedById { get; init; }
    public string Changes { get; init; }
}

