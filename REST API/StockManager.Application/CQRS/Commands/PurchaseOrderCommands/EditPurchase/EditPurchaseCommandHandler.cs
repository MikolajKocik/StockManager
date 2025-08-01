using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.PurchaseOrder.EditPurchase;

public sealed class EditPurchaseOrderCommandHandler : ICommandHandler<EditPurchaseOrderCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<EditPurchaseOrderCommandHandler> _logger;

    public EditPurchaseOrderCommandHandler(
        IPurchaseOrderRepository repository,
        IMapper mapper,
        ILogger<EditPurchaseOrderCommandHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<Unit>> Handle(EditPurchaseOrderCommand command, CancellationToken cancellationToken)
    {
        try
        {
            ResultFailureHelper.IfProvidedNullArgument(command.Id);

            Core.Domain.Models.PurchaseOrderEntity
                .PurchaseOrder? purchaseOrder = await _repository.GetPurchaseOrderByIdAsync(command.Id, cancellationToken);

            if (purchaseOrder is null)
            {
                PurchaseOrderLogWarning.LogPurchaseOrderNotFound(_logger, command.Id, default);
                return Result<Unit>.Failure(new Error(
                    $"PurchaseOrder {command.Id} not found", 
                    ErrorCodes.PurchaseOrderNotFound));
            }

            _mapper.Map(command.UpdateDto, purchaseOrder);
            await _repository.UpdatePurchaseOrderAsync(purchaseOrder, cancellationToken);

            return Result<Unit>.Success(Unit.Value);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Result<Unit>.Failure(new Error("PurchaseOrder violates unique constraints.", ErrorCodes.PurchaseOrderConflict));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Edit PO {Id} failed", command.Id);
            throw;
        }
    }
}
