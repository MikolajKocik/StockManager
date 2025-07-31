using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.EditShipment;

public sealed record EditShipmentCommand(
    int Id,
    ShipmentUpdateDto UpdateDto
    ) : ICommand<Unit>;
