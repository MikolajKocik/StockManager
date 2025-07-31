using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.AddShipment;
public sealed record AddShipmentCommand(
    ShipmentCreateDto CreateDto
    ) : ICommand<ShipmentDto>;
