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
using StockManager.Application.Common.Logging.Shipment;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.AddShipment;

public sealed class AddShipmentCommandHandler : ICommandHandler<AddShipmentCommand, ShipmentDto>
{
    private readonly IShipmentRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<AddShipmentCommandHandler> _logger;

    public AddShipmentCommandHandler(
        IShipmentRepository repository,
        IMapper mapper,
        ILogger<AddShipmentCommandHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<ShipmentDto>> Handle(AddShipmentCommand command, CancellationToken cancellationToken)
    {
        try
        {
            Shipment shipment = _mapper.Map<Shipment>(command.CreateDto);

            Shipment created = await _repository.AddShipmentAsync(shipment, cancellationToken);

            ShipmentDto dto = _mapper.Map<ShipmentDto>(created);

            ShipmentLogInfo.LogShipmentCreated(_logger, dto.Id, default);
            return Result<ShipmentDto>.Success(dto);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            ShipmentLogWarning.LogShipmentAlreadyExists(_logger, command.CreateDto, default, default);
            return Result<ShipmentDto>.Failure(
                new Error(
                    "Shipment violates unique constraints (duplicate).",
                    ErrorCodes.ShipmentConflict));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating Shipment {@createDto}", command.CreateDto);
            throw;
        }
    }
}
