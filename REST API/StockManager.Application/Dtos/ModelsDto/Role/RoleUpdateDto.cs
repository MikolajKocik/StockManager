using System;

namespace StockManager.Application.Dtos.ModelsDto.Role
{
    public sealed record RoleUpdateDto
    {
        public int Id { get; init; }
        public string? Name { get; init; }
    }
}
