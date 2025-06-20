using Microsoft.AspNetCore.Identity;
using UUIDNext;

namespace StockManager.Core.Domain.Models;

public class User : IdentityUser
{
    public User(string userName, string password)
    {
        UserName = userName;
        Slug = $"u_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
        PasswordHash = new PasswordHasher<User>().HashPassword(this, password);
    }
    public User() { }

    public string Slug { get; private set; }
}
