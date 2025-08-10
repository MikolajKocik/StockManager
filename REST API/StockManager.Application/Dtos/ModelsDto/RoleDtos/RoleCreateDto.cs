using System;

namespace StockManager.Application.Dtos.ModelsDto.RoleDtos;

public sealed record RoleCreateDto
{
    public required string Name { get; init; }
}
