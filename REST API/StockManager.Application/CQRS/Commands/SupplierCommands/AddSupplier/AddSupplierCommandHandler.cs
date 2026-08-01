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

namespace StockManager.Application.CQRS.Commands.SupplierCommands.AddSupplier;

public sealed class AddSupplierCommandHandler(
        IMapper mapper,
        ISupplierRepository supplierRepository,
        ILogger<AddSupplierCommandHandler> logger,
        IConnectionMultiplexer redis,
        IUnitOfWork uow
    ) : ICommandHandler<AddSupplierCommand, SupplierDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly ISupplierRepository _supplierRepository = supplierRepository;
    private readonly ILogger<AddSupplierCommandHandler> _logger = logger;
    private readonly IConnectionMultiplexer _redis = redis;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<SupplierDto>> Handle(AddSupplierCommand command, CancellationToken ct)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.Supplier.Name);

        Supplier existingSupplier = await _supplierRepository.FindByNameAsync(command.Supplier.Name, ct);

        if (existingSupplier is not null)
        {
            SupplierLogWarning.LogSupplierAlreadyExists(_logger, command.Supplier.Name, default);

            var error = new Error(
                $"Supplier with name '{command.Supplier.Name}' already exists.",
                ErrorCodes.SupplierConflict);

            return Result<SupplierDto>.Failure(error);
        }

        Supplier newSupplier = _mapper.Map<Supplier>(command.Supplier);

        SupplierLogInfo.LogSupplierAddedSuccesfull(_logger, newSupplier, default);

        _supplierRepository.AddSupplier(newSupplier);
        await _uow.SaveChangesAsync(ct);

        string key = $"supplier:{newSupplier.Id}:views";

        await _redis.IncrementKeyAsync(
            key,
            TimeSpan.FromHours(24),
            ct)
            .ConfigureAwait(false);

        SupplierDto dto = _mapper.Map<SupplierDto>(newSupplier);

        return Result<SupplierDto>.Success(dto);
    }
}
