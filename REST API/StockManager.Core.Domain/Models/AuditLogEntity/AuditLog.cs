using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.UserEntity;

namespace StockManager.Core.Domain.Models.AuditLogEntity;

public sealed class AuditLog
{
    public int Id { get; private set; }
    public string EntityName { get; private set; }      
    public int EntityId { get; private set; }            
    public string Action { get; private set; }           
    public User ChangedBy { get; private set; } // UserName
    public DateTime Timestamp { get; private set; }

    public string Changes { get; private set; }

    private AuditLog() {}
    public AuditLog(
        string entityName, 
        int entityId,
        string action,
        User changedBy,
        DateTime timestamp,
        string changes
        )
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(entityName, nameof(entityName));

        ArgumentException.ThrowIfNullOrWhiteSpace(action, nameof(action));
        
        ArgumentNullException.ThrowIfNull(changedBy, nameof(changedBy));

        if (timestamp > DateTime.UtcNow)
        {
            throw new ArgumentException("Timestamp cannot be in the future", nameof(timestamp));
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(changes, nameof(changes));

        EntityName = entityName;
        EntityId = entityId;
        Action = action;
        ChangedBy = changedBy;
        Timestamp = timestamp;
        Changes = changes;
    }
}
