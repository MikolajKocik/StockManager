using System;

namespace StockManager.Application.Dtos.ModelsDto.ReorderRuleDtos;

public sealed record ReorderRuleUpdateDto
{
    public int Id { get; init; }
    public int? ProductId { get; init; }
    public string? Warehouse { get; init; }
    public decimal? MinLevel { get; init; }
    public decimal? MaxLevel { get; init; }
}

