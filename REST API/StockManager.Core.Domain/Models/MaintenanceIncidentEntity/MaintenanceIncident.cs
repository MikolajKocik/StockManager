using System;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;
using StockManager.Core.Domain.Models.UserEntity;

namespace StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

public sealed class MaintenanceIncident : Entity<int>
{
    public string Title { get; private set; }
    public string Description { get; private set; }
    public IncidentPriority Priority { get; private set; }
    public IncidentStatus Status { get; private set; }
    public string? PhotoUrl { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? ResolvedAt { get; private set; }
    public string? ResolutionNotes { get; private set; }

    public string ReportedById { get; private set; }
    public User ReportedBy { get; private set; }

    public string? AssignedToId { get; private set; }
    public User? AssignedTo { get; private set; }

    public Guid? AssetId { get; private set; }
    public MaintenanceAsset? Asset { get; private set; }

    public int? BinLocationId { get; private set; }
    public BinLocation? BinLocation { get; private set; }

    private MaintenanceIncident() : base() { }

    public MaintenanceIncident(
        string title,
        string description,
        IncidentPriority priority,
        string reportedById,
        string? photoUrl = null,
        Guid? assetId = null,
        int? binLocationId = null
    ) : base()
    {
        Guard.AgainstNullOrWhiteSpace(title, description, reportedById);
        Guard.AgainstInvalidEnumValue(priority);

        Title = title;
        Description = description;
        Priority = priority;
        Status = IncidentStatus.Reported;
        PhotoUrl = photoUrl;
        ReportedById = reportedById;
        AssetId = assetId;
        BinLocationId = binLocationId;
        CreatedAt = DateTime.UtcNow;
    }

    public void AssignTechnician(string technicianId)
    {
        Guard.AgainstNullOrWhiteSpace(technicianId);
        AssignedToId = technicianId;
        Status = IncidentStatus.InProgress;
    }

    public void Resolve(string resolutionNotes)
    {
        Guard.AgainstNullOrWhiteSpace(resolutionNotes);
        ResolutionNotes = resolutionNotes;
        Status = IncidentStatus.Resolved;
        ResolvedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        Status = IncidentStatus.Cancelled;
    }
}
