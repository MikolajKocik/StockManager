using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.PermissionEntity;
using StockManager.Core.Domain.Models.RoleEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IRoleService
{
    void Grant(Role role, Permission perm);
    void Revoke(Role role, Permission perm);
}
