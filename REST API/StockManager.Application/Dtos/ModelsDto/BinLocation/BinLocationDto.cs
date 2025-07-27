using System;

namespace StockManager.Application.Dtos.ModelsDto.BinLocation;

public sealed record BinLocationDto
{
    public int Id { get; }
    public string Code { get; }
    public string Description { get; }
    public string Warehouse { get; }
}

