using System;

namespace StockManager.Application.Dtos.ModelsDto.PermissionDtos;

public sealed record PermissionUpdateDto
{
    public int Id { get; init; }
    public string? Name { get; init; }
    public string? Description { get; init; }
}

