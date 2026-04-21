using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Application.CQRS.Commands.WarehouseOperationCommands;

public sealed class CreateWarehouseOperationCommandHandler : ICommandHandler<CreateWarehouseOperationCommand, WarehouseOperationDto>
{
    private readonly IWarehouseOperationRepository _operationRepository;
    private readonly IInventoryItemRepository _inventoryRepository;
    private readonly IInventoryItemService _inventoryService;
    private readonly IMessageBus _messageBus;
    private readonly IMapper _mapper;
    private readonly ILogger<CreateWarehouseOperationCommandHandler> _logger;

    public CreateWarehouseOperationCommandHandler(
        IWarehouseOperationRepository operationRepository,
        IInventoryItemRepository inventoryRepository,
        IInventoryItemService inventoryService,
        IMessageBus messageBus,
        IMapper mapper,
        ILogger<CreateWarehouseOperationCommandHandler> logger)
    {
        _operationRepository = operationRepository;
        _inventoryRepository = inventoryRepository;
        _inventoryService = inventoryService;
        _messageBus = messageBus;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<WarehouseOperationDto>> Handle(CreateWarehouseOperationCommand command, CancellationToken cancellationToken)
    {
        var operation = new WarehouseOperation(command.Type, command.Date, command.Description);

        foreach (var item in command.Items)
        {
            operation.AddItem(item.ProductId, item.Quantity);

            var inventoryItems = await _inventoryRepository.GetInventoryItemsByProductIdAsync(item.ProductId, cancellationToken);
            var inventoryItem = inventoryItems.FirstOrDefault();

            if (inventoryItem == null)
            {
                return Result<WarehouseOperationDto>.Failure(new Error($"Inventory item for product {item.ProductId} not found.", "Inventory.NotFound"));
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

            await _inventoryRepository.UpdateInventoryItemAsync(inventoryItem, cancellationToken);
        }

        await _operationRepository.AddAsync(operation, cancellationToken);
        
        operation.Complete();
        await _operationRepository.UpdateAsync(operation, cancellationToken);

        await _messageBus.PublishAsync(new { OperationId = operation.Id }, "generate-document");

        var dto = _mapper.Map<WarehouseOperationDto>(operation);
        return Result<WarehouseOperationDto>.Success(dto);
    }
}
