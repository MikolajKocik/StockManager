using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.SalesOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.AddSalesOrder;

public sealed class AddSalesOrderCommandHandler(
        ISalesOrderRepository repository,
        IMapper mapper,
        ILogger<AddSalesOrderCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<AddSalesOrderCommand, SalesOrderDto>
{
    private readonly ISalesOrderRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<AddSalesOrderCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<SalesOrderDto>> Handle(AddSalesOrderCommand command, CancellationToken ct)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.CreateDto);

        SalesOrder salesOrder = _mapper.Map<SalesOrder>(command.CreateDto);

        _repository.AddSalesOrder(salesOrder);
        await _uow.SaveChangesAsync(ct);

        SalesOrderDto dto = _mapper.Map<SalesOrderDto>(salesOrder);

        SalesOrderLogInfo.LogSalesOrderCreated(_logger, dto, null);
        return Result<SalesOrderDto>.Success(dto);
    }
}
