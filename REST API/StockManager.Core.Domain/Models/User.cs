using Microsoft.AspNetCore.Identity;

namespace StockManager.Core.Domain.Models
{
    public class User : IdentityUser
    {
        public User(string userName, string password)
        {
            UserName = userName;
            PasswordHash = new PasswordHasher<User>().HashPassword(this, password);
        }
        public User() { }
    }
}
