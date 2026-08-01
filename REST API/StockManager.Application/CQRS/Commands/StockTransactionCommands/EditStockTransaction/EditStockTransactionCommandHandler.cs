using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.StockTransaction;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.CQRS.Commands.StockTransactionCommands.EditStockTransaction;

public class EditStockTransactionCommandHandler(
        IStockTransactionRepository repository,
        IMapper mapper,
        ILogger<EditStockTransactionCommandHandler> logger,
        IUnitOfWork uow
    ) : IRequestHandler<EditStockTransactionCommand, Result<Unit>>
{
    private readonly IStockTransactionRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<EditStockTransactionCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(EditStockTransactionCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        StockTransaction? stockTransaction = await _repository.GetStockTransactionByIdAsync(command.Id, ct);
        if (stockTransaction is null)
        {
            StockTransactionLogWarning.LogStockTransactionNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error($"StockTransaction with id {command.Id} not found", ErrorCodes.StockTransactionNotFound));
        }

        _mapper.Map(command.UpdateDto, stockTransaction);
        await _uow.SaveChangesAsync(ct);

        StockTransactionDto dto = _mapper.Map<StockTransactionDto>(stockTransaction);

        StockTransactionLogInfo.LogStockTransactionUpdated(_logger, command.Id, default);
        return Result<Unit>.Success(Unit.Value);
    }
}
