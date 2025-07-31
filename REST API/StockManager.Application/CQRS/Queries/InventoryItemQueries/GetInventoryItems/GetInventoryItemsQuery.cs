using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Queries.InventoryItemQueries.GetInventoryItems;
public sealed record GetInventoryItemsQuery(
    string? productName,
    string? binLocationCode,
    string? warehouse,
    decimal? quantityAvailable,
    decimal? quantityOnHand,
    decimal? quantityReserved,
    int PageNumber = 1,
    int PageSize = 10
    ) : IQuery<IEnumerable<InventoryItemDto>>;
