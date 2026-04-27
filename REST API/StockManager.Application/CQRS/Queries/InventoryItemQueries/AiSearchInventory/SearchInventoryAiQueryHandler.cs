using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Extensions.CQRS.Query;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Application.CQRS.Queries.InventoryItemQueries.AiSearchInventory;

public sealed class SearchInventoryAiQueryHandler : IQueryHandler<SearchInventoryAiQuery, List<InventoryItemDto>>
{
    private readonly IRetrievalService _retrievalService;
    private readonly IInventoryItemRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<SearchInventoryAiQueryHandler> _logger;

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public SearchInventoryAiQueryHandler(
        IRetrievalService retrievalService,
        IInventoryItemRepository repository,
        IMapper mapper,
        ILogger<SearchInventoryAiQueryHandler> logger)
    {
        _retrievalService = retrievalService;
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<List<InventoryItemDto>>> Handle(SearchInventoryAiQuery request, CancellationToken cancellationToken)
    {
        try
        {
            string json = await _retrievalService.ExtractDataToJsonAsync(request.UserQuestion, cancellationToken);
            
            if (string.IsNullOrWhiteSpace(json))
            {
                InventoryItemLogError.LogExtractDataInventoryItemException(_logger, default);
                
                return Result<List<InventoryItemDto>>.Failure(new Error(
                    "Failed to extract data to JSON format",
                    ErrorCodes.GeneralBadRequest
                ));
            }

            AiInventoryFiltersDto filters = JsonSerializer.Deserialize<AiInventoryFiltersDto>(json, _jsonOptions) 
                ?? new AiInventoryFiltersDto();

            IQueryable<InventoryItem> query = _repository.GetInventoryItems()
                .IfHasValue(
                    !string.IsNullOrWhiteSpace(filters.ProductName),
                    i => i.Product.Name.Contains(filters.ProductName!))
                .IfHasValue(
                    !string.IsNullOrWhiteSpace(filters.BinLocationCode),
                    i => i.BinLocation.Code == filters.BinLocationCode);

            if (!string.IsNullOrWhiteSpace(filters.Warehouse) && 
                Enum.TryParse(filters.Warehouse, true, out Warehouse parsedWarehouse))
            {
                query = query.Where(i => i.Warehouse == parsedWarehouse);
            }

            if (!string.IsNullOrWhiteSpace(filters.Genre) && 
                Enum.TryParse(filters.Genre, true, out Genre parsedGenre))
            {
                query = query.Where(i => i.Product.Genre == parsedGenre);
            }

            List<InventoryItemDto> filteredItems = await query
                .ProjectTo<InventoryItemDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        
            return Result<List<InventoryItemDto>>.Success(
                filteredItems.Any() 
                    ? filteredItems : []);
        }
        catch (JsonException ex)
        {
            GeneralLogError.InvalidOperationException(_logger, ex.Message, ex);
            
            return Result<List<InventoryItemDto>>.Failure(
                new Error(
                    "AI_PARSE_ERROR", 
                    "Could not understand the search request."));
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
