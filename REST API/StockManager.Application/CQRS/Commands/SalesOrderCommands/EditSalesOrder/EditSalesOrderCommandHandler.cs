using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.SalesOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.EditSalesOrder;

public sealed class EditSalesOrderCommandHandler(
        ISalesOrderRepository repository,
        IMapper mapper,
        ILogger<EditSalesOrderCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<EditSalesOrderCommand, Unit>
{
    private readonly ISalesOrderRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<EditSalesOrderCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(EditSalesOrderCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        SalesOrder? salesOrder = await _repository.GetSalesOrderByIdAsync(command.Id, ct);

        if (salesOrder is null)
        {
            return Result<Unit>.Failure(new Error($"SalesOrder {command.Id} not found", ErrorCodes.SalesOrderNotFound));
        }

        _mapper.Map(command.UpdateDto, salesOrder);
        await _uow.SaveChangesAsync(ct);

        SalesOrderLogInfo.LogSalesOrderUpdated(_logger, salesOrder, null);

        return Result<Unit>.Success(Unit.Value);
    }
}
