using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Queries.InventoryItemQueries.GetInventoryItemById;
public sealed class GetInventoryItemByIdQuery : IQuery<InventoryItemDto>
{
    public int Id { get; set; }

    public GetInventoryItemByIdQuery(int id)
    {
        Id = id;
    }
}
