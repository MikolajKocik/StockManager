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
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Application.Common.Logging.General;
using FluentValidation.Results;
using FluentValidation;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.ReserveQuantity;

public sealed class ReserveInventoryItemQuantityCommandHandler : ICommandHandler<ReserveInventoryItemQuantityCommand, InventoryItemDto>
{
    private readonly IInventoryItemRepository _repository;
    private readonly IInventoryItemService _service;
    private readonly IMapper _mapper;
    private readonly ILogger<ReserveInventoryItemQuantityCommandHandler> _logger;
    private readonly IValidator<ReserveInventoryItemQuantityCommand> _validator;

    public ReserveInventoryItemQuantityCommandHandler(
        IInventoryItemRepository repository,
        IInventoryItemService service,
        IMapper mapper,
        ILogger<ReserveInventoryItemQuantityCommandHandler> logger,
        IValidator<ReserveInventoryItemQuantityCommand> validator
        )
    {
        _repository = repository;
        _service = service;
        _mapper = mapper;
        _logger = logger;
        _validator = validator;
    }

    public async Task<Result<InventoryItemDto>> Handle(ReserveInventoryItemQuantityCommand command, CancellationToken cancellationToken)
    {

        ValidationResult validationResult = await _validator.ValidateAsync(command, cancellationToken);

        if (!validationResult.IsValid)
        {
            InventoryItemLogWarning.LogInventoryItemValidationFailedExtended(
                _logger,
                string.Join(", ", validationResult.Errors),
                default
                );

            return Result<InventoryItemDto>.Failure(new Error(
                "Inventory item validation failed",
                "InventoryItem.ValidationFailed"
            ));
        }

        InventoryItem? inventoryItem = await _repository.GetInventoryItemByIdAsync(command.Id, cancellationToken);

        if (inventoryItem is null)
        {
            InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.Id, default);
            return Result<InventoryItemDto>.Failure(
                new Error(
                "Inventory item not found",
                "InventoryItem.NotFound"));
        }

        try
        {
            _service.ReserveQuantity(inventoryItem, command.Amount);
            await _repository.UpdateInventoryItemAsync(inventoryItem, cancellationToken);

            InventoryItemLogInfo.LogInventoryItemQuantityReserved(_logger, command.Id, command.Amount, default);
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
