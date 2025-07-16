using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.PermissionEntity;
using StockManager.Core.Domain.Models.RoleEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class RoleService : IRoleService
{
    public void Grant(Role role, Permission perm)
        => role.Grant(perm);
    public void Revoke(Role role, Permission perm)
        => role.Revoke(perm);
}
