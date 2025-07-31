using System;

namespace StockManager.Application.Dtos.ModelsDto.RoleDtos;

public sealed record RoleUpdateDto
{
    public int Id { get; init; }
    public string? Name { get; init; }
}
