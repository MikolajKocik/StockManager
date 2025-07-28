using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Validations.InventoryItemValidation;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.IncreaseQuantity;

public sealed class IncreaseInventoryItemQuantityCommandHandler : ICommandHandler<IncreaseInventoryItemQuantityCommand, InventoryItemDto>
{
    private readonly IInventoryItemRepository _repository;
    private readonly IInventoryItemService _service;
    private readonly IMapper _mapper;
    private readonly ILogger<IncreaseInventoryItemQuantityCommandHandler> _logger;
    private readonly IValidator<IncreaseInventoryItemQuantityCommand> _validator;

    public IncreaseInventoryItemQuantityCommandHandler(
        IInventoryItemRepository repository,
        IInventoryItemService service,
        IMapper mapper,
        ILogger<IncreaseInventoryItemQuantityCommandHandler> logger,
        IValidator<IncreaseInventoryItemQuantityCommand> validator
        )
    {
        _repository = repository;
        _service = service;
        _mapper = mapper;
        _logger = logger;
        _validator = validator;
    }

    public async Task<Result<InventoryItemDto>> Handle(IncreaseInventoryItemQuantityCommand command, CancellationToken cancellationToken)
    {
        ValidationResult validationResult = await _validator.ValidateAsync(command, cancellationToken);

        if (!validationResult.IsValid)
        {
            InventoryItemLogWarning.LogInventoryItemValidationQuantityOperationFailed(
                _logger, 
                string.Join(", ", validationResult.Errors),
                default);

            return Result<InventoryItemDto>.Failure(
                new Error(
                    "Validation failed",
                    "InventoryItem.ValidationError"));
        }

        try
        {
            await using IDbContextTransaction transaction = await _repository.BeginTransactionAsync(cancellationToken);

            InventoryItem? inventoryItem = await _repository.GetInventoryItemByIdAsync(command.Id, cancellationToken);

            if (inventoryItem is null)
            {
                InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.Id, default);
                return Result<InventoryItemDto>.Failure(
                    new Error(
                        "Inventory item not found",
                        "InventoryItem.NotFound"));
            }

            _service.IncreaseQuantity(inventoryItem, command.Amount);
            await _repository.UpdateInventoryItemAsync(inventoryItem, cancellationToken);

            InventoryItemLogInfo.LogInventoryItemQuantityIncreased(_logger, command.Id, command.Amount, default);
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
