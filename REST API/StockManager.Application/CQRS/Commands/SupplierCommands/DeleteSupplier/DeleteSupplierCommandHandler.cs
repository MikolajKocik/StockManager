using AutoMapper;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Supplier;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Models;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.DeleteSupplier;

public sealed class DeleteSupplierCommandHandler : ICommandHandler<DeleteSupplierCommand, SupplierDto>
{
    private readonly IMapper _mapper;
    private readonly ISupplierRepository _supplierRepository;
    private readonly ILogger<DeleteSupplierCommandHandler> _logger;

    public DeleteSupplierCommandHandler(IMapper mapper, ISupplierRepository repository,
        ILogger<DeleteSupplierCommandHandler> logger)
    {
        _mapper = mapper;
        _supplierRepository = repository;
        _logger = logger;
    }

    public async Task<Result<SupplierDto>> Handle(DeleteSupplierCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await using IDbContextTransaction transaction = await _supplierRepository.BeginTransactionAsync();

            Supplier supplier = await _supplierRepository.GetSupplierByIdAsync(command.Id, cancellationToken);

            if (supplier is not null)
            {
                SupplierLogInfo.LogRemovingSupplier(_logger, command.Id, default);
                Supplier remove = await _supplierRepository.DeleteSupplierAsync(supplier, cancellationToken);

                SupplierDto dto = _mapper.Map<SupplierDto>(remove);

                await transaction.CommitAsync(cancellationToken);

                return Result<SupplierDto>.Success(dto);
            }
            else
            {
                SupplierLogWarning.LogSupplierNotFound(_logger, command.Id, default);
                await transaction.RollbackAsync(cancellationToken);

                var error = new Error(
                    $"Supplier with id {command.Id} not found",
                    ErrorCodes.SupplierNotFound
                );

                return Result<SupplierDto>.Failure(error);
            }
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
