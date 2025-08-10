using System;

namespace StockManager.Application.Dtos.ModelsDto.UserDtos;

public sealed record UserDto
{
    public required string Id { get; init;  }
    public required string UserName { get; init; }
    public required string Slug { get; init; }
    public string? Email { get; init; }
    public string? PhoneNumber { get; init; }
}
