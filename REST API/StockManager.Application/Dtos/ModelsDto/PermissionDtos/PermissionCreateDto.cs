using System;

namespace StockManager.Application.Dtos.ModelsDto.PermissionDtos;

public sealed record PermissionCreateDto
{
    public string Name { get; init; }
    public string Description { get; init; }
}

