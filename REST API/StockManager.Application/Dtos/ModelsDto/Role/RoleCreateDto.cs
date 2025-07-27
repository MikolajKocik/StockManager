using System;

namespace StockManager.Application.Dtos.ModelsDto.Role
{
    public sealed record RoleCreateDto
    {
        public string Name { get; init; }
    }
}
