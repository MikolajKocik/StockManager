using AutoMapper;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Supplier;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.EditSupplier;

public sealed class EditSupplierCommandHandler(
        ISupplierRepository supplierRepository,
        IMapper mapper,
        ILogger<EditSupplierCommandHandler> logger,
        IConnectionMultiplexer redis,
        IUnitOfWork uow
    ) : ICommandHandler<EditSupplierCommand, SupplierDto>
{
    private readonly ISupplierRepository _supplierRepository = supplierRepository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<EditSupplierCommandHandler> _logger = logger;
    private readonly IConnectionMultiplexer _redis = redis;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<SupplierDto>> Handle(EditSupplierCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Supplier? supplier = await _supplierRepository.GetSupplierByIdAsync(command.Id, ct);

        if (supplier is not null)
        {
            SupplierLogInfo.LogModyfingSupplier(_logger, command.Id, command.Supplier, default);

            _mapper.Map(command.Supplier, supplier);
            await _uow.SaveChangesAsync(ct);

            SupplierDto supplierModified = _mapper.Map<SupplierDto>(supplier);

            await _redis.RemoveKeyAsync($"supplier:{command.Id}:details");

            return Result<SupplierDto>.Success(supplierModified);
        }

        SupplierLogWarning.LogSupplierNotFound(_logger, command.Id, default);

        var error = new Error(
            $"Supplier with id {command.Id} not found",
            ErrorCodes.SupplierNotFound
        );

        return Result<SupplierDto>.Failure(error);
    }
}
