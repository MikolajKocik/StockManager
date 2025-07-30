using System;

namespace StockManager.Application.Dtos.ModelsDto.PermissionDtos;

public sealed record PermissionDto
{
    public int Id { get; init; }
    public string Name { get; init; }
    public string Description { get; init; }
    public IReadOnlyCollection<string>? Roles { get; init; }
}

