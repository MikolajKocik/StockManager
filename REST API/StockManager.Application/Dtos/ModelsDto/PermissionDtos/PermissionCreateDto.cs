using System;

namespace StockManager.Application.Dtos.ModelsDto.PermissionDtos;

public sealed record PermissionCreateDto
{
    public required string Name { get; init; }
    public required string Description { get; init; }
}

