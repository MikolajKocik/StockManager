using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Application.CQRS.Commands.WarehouseOperationCommands;

public sealed class CreateWarehouseOperationCommandHandler(
        IWarehouseOperationRepository operationRepository,
        IInventoryItemRepository inventoryRepository,
        IInventoryItemService inventoryService,
        IMessageBus messageBus,
        IMapper mapper,
        ILogger<CreateWarehouseOperationCommandHandler> logger,
        ISystemStatisticsService statisticsService,
        IUnitOfWork uow
    ) : ICommandHandler<CreateWarehouseOperationCommand, WarehouseOperationDto>
{
    private readonly IWarehouseOperationRepository _operationRepository = operationRepository;
    private readonly IInventoryItemRepository _inventoryRepository = inventoryRepository;
    private readonly IInventoryItemService _inventoryService = inventoryService;
    private readonly IMessageBus _messageBus = messageBus;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<CreateWarehouseOperationCommandHandler> _logger = logger;
    private readonly ISystemStatisticsService _statisticsService = statisticsService;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<WarehouseOperationDto>> Handle(CreateWarehouseOperationCommand command, CancellationToken ct)
    {
        var operation = new WarehouseOperation(command.Type, command.Date, command.Description);

        var productIds = command.Items.Select(item => item.ProductId).Distinct().ToList();

        List<InventoryItem> inventoryItems = await _inventoryRepository.GetInventoryItems()
            .Where(ii => productIds.Contains(ii.ProductId))
            .ToListAsync(ct);

        var inventoryMap = inventoryItems
            .GroupBy(ii => ii.ProductId)
            .ToDictionary(g => g.Key, g => g.First());

        foreach (OperationItemDto item in command.Items)
        {
            operation.AddItem(item.ProductId, item.Quantity);

            if (!inventoryMap.TryGetValue(item.ProductId, out InventoryItem? inventoryItem) || inventoryItem is null)
            {
                return Result<WarehouseOperationDto>.Failure(
                    new Error(
                        $"Inventory item for product {item.ProductId} not found.",
                        "Inventory.NotFound"));
            }

            // Update stock based on operation type
            switch (command.Type)
            {
                case OperationType.PZ:
                    _inventoryService.IncreaseQuantity(inventoryItem, item.Quantity);
                    break;
                case OperationType.WZ:
                case OperationType.RW:
                    _inventoryService.DecreaseQuantity(inventoryItem, item.Quantity);
                    break;
                case OperationType.MM:
                    break;
            }
        }

        _operationRepository.AddOperation(operation);

        operation.Complete();

        await _uow.SaveChangesAsync(ct);

        GeneralLogInfo.Information(_logger, $"Warehouse operation {operation.Id} created.", null);

        await _messageBus.PublishAsync(new { OperationId = operation.Id }, "generate-document", ct);
        _statisticsService.IncrementProcessedOperations();

        WarehouseOperationDto dto = _mapper.Map<WarehouseOperationDto>(operation);
        return Result<WarehouseOperationDto>.Success(dto);
    }
}
