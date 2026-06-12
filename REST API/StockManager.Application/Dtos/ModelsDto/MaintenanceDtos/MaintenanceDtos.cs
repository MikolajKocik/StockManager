using System;
using System.Collections.Generic;

namespace StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;

public sealed record MaintenanceAssetDto
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required string SerialNumber { get; init; }
    public required string Type { get; init; }
    public required string Status { get; init; }
    public DateTime? LastServiceDate { get; init; }
    public int? BinLocationId { get; init; }
    public string? BinLocationCode { get; init; }
}

public sealed record MaintenanceIncidentDto
{
    public int Id { get; init; }
    public required string Title { get; init; }
    public required string Description { get; init; }
    public required string Priority { get; init; }
    public required string Status { get; init; }
    public string? PhotoUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? ResolvedAt { get; init; }
    public string? ResolutionNotes { get; init; }
    public required string ReportedById { get; init; }
    public string? ReportedByName { get; init; }
    public string? AssignedToId { get; init; }
    public string? AssignedToName { get; init; }
    public Guid? AssetId { get; init; }
    public string? AssetName { get; init; }
    public int? BinLocationId { get; init; }
    public string? BinLocationCode { get; init; }
}

public sealed record ReportIncidentDto
{
    public required string Title { get; init; }
    public required string Description { get; init; }
    public required string Priority { get; init; }
    public string? PhotoUrl { get; init; }
    public Guid? AssetId { get; init; }
    public int? BinLocationId { get; init; }
}

public sealed record ResolveIncidentDto
{
    public required string ResolutionNotes { get; init; }
}

public sealed record AssignIncidentDto
{
    public required string AssignedToId { get; init; }
}

