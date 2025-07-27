using System;

namespace StockManager.Application.Dtos.ModelsDto.User;

public sealed record UserDto
{
    public string Id { get; }
    public string UserName { get; }
    public string Slug { get; }
    public string? Email { get; }
    public string? PhoneNumber { get; }
}
