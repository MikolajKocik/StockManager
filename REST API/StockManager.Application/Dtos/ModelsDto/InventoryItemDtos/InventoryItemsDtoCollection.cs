using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
public sealed record InventoryItemsDtoCollection
{
    public required IEnumerable<InventoryItemDto> Data { get; init; }
}
