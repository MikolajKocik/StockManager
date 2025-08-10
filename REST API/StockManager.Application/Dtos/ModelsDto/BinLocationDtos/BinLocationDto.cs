using System;

namespace StockManager.Application.Dtos.ModelsDto.BinLocationDtos;

public sealed record BinLocationDto
{
    public int Id { get; init; }
    public required string Code { get; init; }
    public required string Description { get; init; }
    public required string Warehouse { get; init; }
}

