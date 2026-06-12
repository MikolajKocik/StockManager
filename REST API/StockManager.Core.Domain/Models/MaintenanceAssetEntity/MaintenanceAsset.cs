using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

namespace StockManager.Core.Domain.Models.MaintenanceAssetEntity;

public sealed class MaintenanceAsset : Entity<Guid>
{
    public string Name { get; }
    public string SerialNumber { get; }
    public AssetType Type { get; }
    public AssetStatus Status { get; private set; }
    public DateTime? LastServiceDate { get; private set; }

    public int? BinLocationId { get; private set; }
    public BinLocation? BinLocation { get; }

    private readonly List<MaintenanceIncident> _incidents = new();
    public IReadOnlyCollection<MaintenanceIncident> Incidents => _incidents.AsReadOnly();

    private MaintenanceAsset() : base() { }

    public MaintenanceAsset(
        string name,
        string serialNumber,
        AssetType type,
        int? binLocationId = null
    ) : base(Guid.NewGuid())
    {
        if (binLocationId.HasValue)
        {
            Guard.AgainstDefaultValue(binLocationId.Value);
        }
        Guard.AgainstNullOrWhiteSpace(name, serialNumber);
        Guard.AgainstInvalidEnumValue(type);

        Name = name;
        SerialNumber = serialNumber;
        Type = type;
        Status = AssetStatus.Operational;
        BinLocationId = binLocationId;
    }

    public void UpdateStatus(AssetStatus newStatus)
    {
        Guard.AgainstInvalidEnumValue(newStatus);
        Status = newStatus;
    }

    public void RecordService(DateTime serviceDate)
    {
        Guard.IsValidDate(serviceDate);
        LastServiceDate = serviceDate;
        Status = AssetStatus.Operational;
    }
}
