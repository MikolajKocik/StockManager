using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using MediatR;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using FluentValidation.Results;
using StockManager.Application.Abstractions.CQRS.Command;
using FluentValidation;
using StockManager.Application.Validations.InventoryItemValidation;
using StockManager.Application.Common.Logging.General;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.DecreaseQuantity;

public sealed class DecreaseInventoryItemQuantityCommandHandler : ICommandHandler<DecreaseInventoryItemQuantityCommand, InventoryItemDto>
{
    private readonly IInventoryItemRepository _repository;
    private readonly IInventoryItemService _service;
    private readonly IMapper _mapper;
    private readonly ILogger<DecreaseInventoryItemQuantityCommandHandler> _logger;

    public DecreaseInventoryItemQuantityCommandHandler(
        IInventoryItemRepository repository,
        IInventoryItemService service,
        IMapper mapper,
        ILogger<DecreaseInventoryItemQuantityCommandHandler> logger
        )
    {
        _repository = repository;
        _service = service;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<InventoryItemDto>> Handle(DecreaseInventoryItemQuantityCommand command, CancellationToken cancellationToken)
    {
       try
        {
            InventoryItem? inventoryItem = await _repository.GetInventoryItemByIdAsync(command.Id, cancellationToken);

            if (inventoryItem is null)
            {
                InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.Id, default);
                return Result<InventoryItemDto>.Failure(new Error("Inventory item not found", "InventoryItem.NotFound"));
            }

            _service.DecreaseQuantity(inventoryItem, command.Amount);

            await _repository.UpdateInventoryItemAsync(inventoryItem, cancellationToken);
            InventoryItemLogInfo.LogInventoryItemQuantityDecreased(_logger, command.Id, command.Amount, default);

            InventoryItemDto dto = _mapper.Map<InventoryItemDto>(inventoryItem);
            return Result<InventoryItemDto>.Success(dto);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
