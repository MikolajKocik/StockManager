using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Validations.InventoryItemValidation;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;

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
            ResultFailureHelper.IfProvidedNullArgument(command.Id);

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
