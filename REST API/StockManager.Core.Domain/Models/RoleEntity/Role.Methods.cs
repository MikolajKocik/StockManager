using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.PermissionEntity;

namespace StockManager.Core.Domain.Models.RoleEntity;

public sealed partial class Role
{
    public void Grant(Permission perm)
    {
        if (!_permissions.Contains(perm))
        {
            _permissions.Add(perm);
        }
    }

    public void Revoke(Permission perm)
    {
        _permissions.Remove(perm);
    }
}
