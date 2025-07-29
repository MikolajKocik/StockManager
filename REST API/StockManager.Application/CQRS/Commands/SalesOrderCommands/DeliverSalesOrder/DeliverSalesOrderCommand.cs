using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.DeliverSalesOrder;
public sealed record DeliverSalesOrderCommand(
    int Id,
    DateTime DeliveredDate
    ) : ICommand<Unit>;
