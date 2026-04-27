using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

public sealed record AiInventoryFiltersDto
{
    [JsonPropertyName("productName")]
    public string? ProductName { get; init; }

    [JsonPropertyName("warehouse")]
    public string? Warehouse { get; init; }

    [JsonPropertyName("binLocationCode")]
    public string? BinLocationCode { get; init; }

    [JsonPropertyName("genre")]
    public string? Genre { get; init; }
}
