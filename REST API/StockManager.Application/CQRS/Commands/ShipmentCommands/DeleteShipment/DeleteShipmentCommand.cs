using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.DeleteShipment;

public sealed record DeleteShipmentCommand(
    int Id
    ) : ICommand<Unit>;
