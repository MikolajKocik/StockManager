﻿namespace StockManager.Core.Domain.Dtos.Authorization
{
    public class RegisterDto
    {
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
