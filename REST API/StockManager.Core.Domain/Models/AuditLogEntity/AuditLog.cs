using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.UserEntity;

namespace StockManager.Core.Domain.Models.AuditLogEntity;

public sealed class AuditLog : Entity<int>
{
    public string EntityName { get; private set; }      
    public int EntityId { get; private set; }            
    public string Action { get; private set; }           
    public DateTime Timestamp { get; private set; }
    public string Changes { get; private set; }

    // relation *-1 with user
    public string ChangedById { get; private set; }
    public User ChangedBy { get; private set; } // UserName

    private AuditLog() : base() {}

    public AuditLog(
        string entityName, 
        int entityId,
        string action,
        string changedById,
        DateTime timestamp,
        string changes
        ) : base()
    {
        Guard.AgainstNullOrWhiteSpace(entityName, action, changedById, changes);
        Guard.AgainstDefaultValue(entityId);
        Guard.IsValidDate(timestamp);

        EntityName = entityName;
        EntityId = entityId;
        Action = action;
        ChangedById = changedById;
        Timestamp = timestamp;
        Changes = changes;
    }

    public AuditLog(
        int id,
        string entityName,
        int entityId,
        string action,
        string changedById,
        DateTime timestamp,
        string changes
        ) : base(id)
    {
        Guard.AgainstNullOrWhiteSpace(entityName, action, changedById, changes);
        Guard.AgainstDefaultValue(entityId);
        Guard.IsValidDate(timestamp);

        EntityName = entityName;
        EntityId = entityId;
        Action = action;
        ChangedById = changedById;
        Timestamp = timestamp;
        Changes = changes;
    }
}
