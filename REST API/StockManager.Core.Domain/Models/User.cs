using Microsoft.AspNetCore.Identity;

namespace StockManager.Core.Domain.Models
{
    public class User : IdentityUser
    {
        public string Username { get; set; }
        public string Password { get; set; }

        public User(string username, string password)
        {
            Username = username;
            Password = password;
        }
        public User() { }
    }
}
