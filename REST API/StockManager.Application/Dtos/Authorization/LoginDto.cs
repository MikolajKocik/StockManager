namespace StockManager.Core.Application.Dtos.Authorization;

public sealed class LoginDto
{
    public required string UserName { get; set; }
    public required string Password { get; set; } 
}
