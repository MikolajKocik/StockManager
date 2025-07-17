using Microsoft.AspNetCore.Identity;
using StockManager.Core.Domain.Models.AuditLogEntity;
using UUIDNext;

namespace StockManager.Core.Domain.Models.UserEntity;

public class User : IdentityUser
{
    public User(string userName, string password)
    {
        UserName = userName;
        Slug = $"u_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
        PasswordHash = new PasswordHasher<User>().HashPassword(this, password);
    }
    public User() { }

    public string Slug { get; private set; } = default!;

    // relation 1-* with auditLogs
    private readonly List<AuditLog> _auditLogs = new();
    public IReadOnlyCollection<AuditLog> AuditLogs
        => _auditLogs.AsReadOnly();
}
