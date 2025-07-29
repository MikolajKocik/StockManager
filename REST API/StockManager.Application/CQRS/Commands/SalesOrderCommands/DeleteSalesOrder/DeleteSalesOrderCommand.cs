using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.DeleteSalesOrder;
public sealed record DeleteSalesOrderCommand(
    int Id
    ) : ICommand<Unit>;
