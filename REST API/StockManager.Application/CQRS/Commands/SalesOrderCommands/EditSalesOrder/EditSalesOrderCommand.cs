using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.EditSalesOrder;
public sealed record EditSalesOrderCommand(
    int Id,
    SalesOrderUpdateDto UpdateDto
    ) : ICommand<Unit>;
