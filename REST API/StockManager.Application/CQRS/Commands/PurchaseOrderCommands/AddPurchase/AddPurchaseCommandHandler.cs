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
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.PurchaseOrder.AddPurchase;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.AddPurchase;

public sealed class AddPurchaseOrderCommandHandler : ICommandHandler<AddPurchaseOrderCommand, PurchaseOrderDto>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<AddPurchaseOrderCommandHandler> _logger;

    public AddPurchaseOrderCommandHandler(
        IPurchaseOrderRepository repository, 
        IMapper mapper,
        ILogger<AddPurchaseOrderCommandHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<PurchaseOrderDto>> Handle(AddPurchaseOrderCommand command, CancellationToken cancellationToken)
    {
        try
        {
            ResultFailureHelper.IfProvidedNullArgument(command.CreateDto);

            Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder purchaseOrder = 
                _mapper.Map<Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder>(command.CreateDto);

            Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder created = await _repository.AddPurchaseOrderAsync(purchaseOrder, cancellationToken);

            PurchaseOrderDto dto = _mapper.Map<PurchaseOrderDto>(created);
            return Result<PurchaseOrderDto>.Success(dto);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Result<PurchaseOrderDto>.Failure(
                new Error(
                    "Duplicate purchase order.",
                    ErrorCodes.PurchaseOrderConflict));
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
