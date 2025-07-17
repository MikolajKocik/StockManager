using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.SharedModels.RolePermissionsEntity;

/// <summary>
/// Join table for many-to-many relationship between classes role and permission
/// </summary>

public sealed class RolePermissions
{
    public int PermissionId { get; private set; }
    public int RoleId { get; private set; }
}
