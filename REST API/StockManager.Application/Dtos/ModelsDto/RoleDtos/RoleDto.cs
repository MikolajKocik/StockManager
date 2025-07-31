using System;

namespace StockManager.Application.Dtos.ModelsDto.RoleDtos;

public sealed record RoleDto
{
    public int Id { get; init; }
    public string Name { get; init; }
    public IReadOnlyCollection<string>? Permissions { get; init; } 
}
