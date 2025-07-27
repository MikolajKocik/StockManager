using System;

namespace StockManager.Application.Dtos.ModelsDto.Permission;

public sealed record PermissionCreateDto
{
    public string Name { get; init; }
    public string Description { get; init; }
}

