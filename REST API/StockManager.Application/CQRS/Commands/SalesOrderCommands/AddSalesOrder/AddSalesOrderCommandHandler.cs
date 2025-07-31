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
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.AddSalesOrder;
public sealed class AddSalesOrderCommandHandler : ICommandHandler<AddSalesOrderCommand, SalesOrderDto>
{
    private readonly ISalesOrderRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<AddSalesOrderCommandHandler> _logger;

    public AddSalesOrderCommandHandler(
        ISalesOrderRepository repository,
        IMapper mapper,
        ILogger<AddSalesOrderCommandHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<SalesOrderDto>> Handle(AddSalesOrderCommand command, CancellationToken cancellationToken)
    {
        try
        {
            SalesOrder salesOrder = _mapper.Map<SalesOrder>(command.CreateDto);

            SalesOrder created = await _repository.AddSalesOrderAsync(salesOrder, cancellationToken);

            SalesOrderDto dto = _mapper.Map<SalesOrderDto>(created);
            return Result<SalesOrderDto>.Success(dto);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Result<SalesOrderDto>.Failure(
                new Error(
                    "Duplicate sales order.", 
                    ErrorCodes.SalesOrderConflict));
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
