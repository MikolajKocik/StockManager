namespace StockManager.Core.Application.Dtos.Authorization
{
    public sealed class RegisterDto
    {
        public required string UserName { get; set; }
        public required string Password { get; set; }
    }
}
