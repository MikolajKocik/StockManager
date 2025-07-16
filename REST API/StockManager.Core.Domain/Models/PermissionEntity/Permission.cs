using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Models.PermissionEntity;

public sealed class Permission
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }

    private Permission() { }
    public Permission(string name, string description)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name, nameof(name));
        Name = name;
        Description = description ?? "";
    }
}
