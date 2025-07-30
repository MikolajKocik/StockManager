using System;

namespace StockManager.Application.Dtos.ModelsDto.BinLocationDtos;

public sealed record BinLocationDto
{
    public int Id { get; init; }
    public string Code { get; init; }
    public string Description { get; init; }
    public string Warehouse { get; init; }
}

