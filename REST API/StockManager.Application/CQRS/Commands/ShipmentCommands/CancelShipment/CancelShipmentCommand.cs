using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;

namespace StockManager.Application.CQRS.Commands.ShipmentCommands.CancelShipment;
public sealed record CancelShipmentCommand(
    int Id
    ) : ICommand<Unit>;
