using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.RoleEntity;

namespace StockManager.Core.Domain.Models.PermissionEntity;

public sealed class Permission : Entity<int>
{
    public string Name { get; private set; }
    public string Description { get; private set; }

    // relation *-* with role
    private readonly List<Role> _roles = new();
    public IReadOnlyCollection<Role> Roles
        => _roles.AsReadOnly();

    private Permission() : base() { }

    public Permission(
        int id,
        string name,
        string description
        ) : base(id)
    {
        Guard.AgainstNullOrWhiteSpace(name, nameof(name));
        Name = name;
        Description = description ?? "";
    }
    public Permission(
      string name,
      string description
      ) : base()
    {
        Guard.AgainstNullOrWhiteSpace(name, nameof(name));
        Name = name;
        Description = description ?? "";
    }
}
