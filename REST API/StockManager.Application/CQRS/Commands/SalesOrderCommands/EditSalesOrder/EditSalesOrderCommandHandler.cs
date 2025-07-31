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
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.EditSalesOrder;
public sealed class EditSalesOrderCommandHandler : ICommandHandler<EditSalesOrderCommand, Unit>
{
    private readonly ISalesOrderRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<EditSalesOrderCommandHandler> _logger;

    public EditSalesOrderCommandHandler(
        ISalesOrderRepository repository, 
        IMapper mapper, 
        ILogger<EditSalesOrderCommandHandler> logger
        )
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<Unit>> Handle(EditSalesOrderCommand command, CancellationToken cancellationToken)
    {
        try
        {
            Core.Domain.Models.SalesOrderEntity.SalesOrder? salesOrder = await _repository.GetSalesOrderByIdAsync(command.Id, cancellationToken);
            if (salesOrder is null)
            {
                return Result<Unit>.Failure(new Error($"SalesOrder {command.Id} not found", ErrorCodes.SalesOrderNotFound));
            }

            _mapper.Map(command.UpdateDto, salesOrder);
            await _repository.UpdateSalesOrderAsync(salesOrder, cancellationToken);

            return Result<Unit>.Success(Unit.Value);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Result<Unit>.Failure(
                new Error(
                    "SalesOrder violates unique constraints.",
                    ErrorCodes.SalesOrderConflict));
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
