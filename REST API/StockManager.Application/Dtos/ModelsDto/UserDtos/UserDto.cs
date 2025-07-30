using System;

namespace StockManager.Application.Dtos.ModelsDto.UserDtos;

public sealed record UserDto
{
    public string Id { get; init;  }
    public string UserName { get; init; }
    public string Slug { get; init; }
    public string? Email { get; init; }
    public string? PhoneNumber { get; init; }
}
