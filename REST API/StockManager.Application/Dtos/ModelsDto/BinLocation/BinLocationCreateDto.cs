using System;

namespace StockManager.Application.Dtos.ModelsDto.BinLocation;

 public sealed record BinLocationCreateDto
{
    public string Code { get; init; }
    public string Description { get; init; }
    public string Warehouse { get; init; }
}

