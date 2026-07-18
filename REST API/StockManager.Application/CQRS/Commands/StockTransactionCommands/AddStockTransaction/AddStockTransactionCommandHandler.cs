using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.StockTransaction;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.CQRS.Commands.StockTransactionCommands.AddStockTransaction;

public class AddStockTransactionCommandHandler(
        IStockTransactionRepository repository,
        IMapper mapper,
        ILogger<AddStockTransactionCommandHandler> logger,
        IUnitOfWork uow
    ) : IRequestHandler<AddStockTransactionCommand, Result<StockTransactionDto>>
{
    private readonly IStockTransactionRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<AddStockTransactionCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<StockTransactionDto>> Handle(AddStockTransactionCommand command, CancellationToken ct)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.CreateDto);

        StockTransaction stockTransaction = _mapper.Map<StockTransaction>(command.CreateDto);
        _repository.AddStockTransaction(stockTransaction);
        await _uow.SaveChangesAsync(ct);

        StockTransactionLogInfo.LogStockTransactionCreated(_logger, command.CreateDto, default);

        return Result<StockTransactionDto>.Success(_mapper.Map<StockTransactionDto>(stockTransaction));
    }
}
