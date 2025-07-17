using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.RoleEntity;

namespace StockManager.Core.Domain.Models.PermissionEntity;

public sealed class Permission
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }

    // relation *-* with role
    private readonly List<Role> _roles = new();
    public IReadOnlyCollection<Role> Roles
        => _roles.AsReadOnly();

    private Permission() { }
    public Permission(string name, string description)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name, nameof(name));
        Name = name;
        Description = description ?? "";
    }
}
