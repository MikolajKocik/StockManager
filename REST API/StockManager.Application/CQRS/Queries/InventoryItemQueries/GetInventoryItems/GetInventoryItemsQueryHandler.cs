using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Extensions.CQRS.Query;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Queries.InventoryItemQueries.GetInventoryItems;
public sealed class GetInventoryItemsQueryHandler : IQueryHandler<GetInventoryItemsQuery, IEnumerable<InventoryItemDto>>
{
    private readonly IMapper _mapper;
    private readonly IInventoryItemRepository _repository;

    public GetInventoryItemsQueryHandler(IMapper mapper, IInventoryItemRepository repository)
    {
        _mapper = mapper;
        _repository = repository;
    }

    public async Task<Result<IEnumerable<InventoryItemDto>>> Handle(GetInventoryItemsQuery query, CancellationToken cancellationToken)
    {
        IQueryable<InventoryItem> inventoryItems = _repository.GetInventoryItems()
           .IfHasValue(
               !string.IsNullOrWhiteSpace(query.productName),
               p => EF.Functions.Like(p.Product.Name, $"%{query.productName}%"))
           .IfHasValue(
               !string.IsNullOrWhiteSpace(query.binLocationCode),
               p => EF.Functions.Like(p.BinLocation.Code, $"%{query.binLocationCode}%"))
           .IfHasValue(
               query.quantityOnHand.HasValue,
                p => p.QuantityOnHand == query.quantityOnHand!.Value)
           .IfHasValue(
               query.quantityReserved.HasValue,
                p => p.QuantityReserved == query.quantityReserved!.Value)
           .IfHasValue(
                query.quantityAvailable.HasValue,
                 p => p.QuantityAvailable == query.quantityAvailable!.Value);


        if (!string.IsNullOrWhiteSpace(query.warehouse))
        {
            if (Enum.TryParse(query.warehouse, true, out Warehouse warehouse))
            {

                inventoryItems = inventoryItems.Where(p => p.Warehouse == warehouse);
            }
        }

        IEnumerable<InventoryItemDto> dtos =  await inventoryItems
            .ProjectTo<InventoryItemDto>(_mapper.ConfigurationProvider)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<InventoryItemDto>>.Success(
            dtos.Any() ? dtos : Enumerable.Empty<InventoryItemDto>());
    }
}
