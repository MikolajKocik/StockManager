using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Core.Domain.Enums;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.AddSalesOrderLine;
public sealed record AddSalesOrderLineCommand(
    int SalesOrderId,
    int ProductId,
    decimal Quantity,
    decimal Price,
    UnitOfMeasure Unit)
    : ICommand<Unit>;
