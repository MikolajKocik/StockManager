using System;

namespace StockManager.Application.Dtos.ModelsDto.RoleDtos;

public sealed record RoleDto
{
    public int Id { get; }
    public string Name { get; }
    public IReadOnlyCollection<string>? Permissions { get; } 
}
