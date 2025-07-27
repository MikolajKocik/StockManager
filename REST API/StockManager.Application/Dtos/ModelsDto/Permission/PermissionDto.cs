using System;

namespace StockManager.Application.Dtos.ModelsDto.Permission;

public sealed record PermissionDto
{
    public int Id { get; }
    public string Name { get; }
    public string Description { get; }
    public IReadOnlyCollection<string>? Roles { get; }
}

