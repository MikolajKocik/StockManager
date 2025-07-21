using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.PermissionEntity;

namespace StockManager.Core.Domain.Models.RoleEntity;

public sealed partial class Role : Entity<int>
{
    public string Name { get; private set; }

    // relation *-* with permission
    private readonly List<Permission> _permissions = new();
    public IReadOnlyList<Permission> Permissions 
        => _permissions.AsReadOnly();

    private Role() : base() { }

    public Role(
        int id,
        string name
        ) : base(id)
    {
        Guard.AgainstNullOrWhiteSpace(name, nameof(name));
        Name = name;
    }

    public Role(
        string name
        ) : base()
    {
        Guard.AgainstNullOrWhiteSpace(name, nameof(name));

        Name = name;
    }
}
