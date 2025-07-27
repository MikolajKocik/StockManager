using System;

namespace StockManager.Application.Dtos.ModelsDto.RoleDtos;

public sealed record RoleCreateDto
{
    public string Name { get; init; }
}
