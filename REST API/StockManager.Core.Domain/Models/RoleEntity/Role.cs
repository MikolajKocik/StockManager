using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.PermissionEntity;

namespace StockManager.Core.Domain.Models.RoleEntity;

public sealed partial class Role
{
    public int Id { get; private set; }
    public string Name { get; private set; }

    // relation *-* with permission
    private readonly List<Permission> _permissions = new();
    public IReadOnlyList<Permission> Permissions 
        => _permissions.AsReadOnly();

    private Role() { }
    public Role(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name, nameof(name));
        Name = name;
    }
}
