using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Queries.InventoryItemQueries.AiSearchInventory;

public sealed record SearchInventoryAiQuery(string UserQuestion) 
    : IQuery<List<InventoryItemDto>>;
