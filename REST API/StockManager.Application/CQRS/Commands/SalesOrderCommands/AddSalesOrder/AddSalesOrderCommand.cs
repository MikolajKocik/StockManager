using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.AddSalesOrder;
public sealed record AddSalesOrderCommand(
    SalesOrderCreateDto CreateDto
    ): ICommand<SalesOrderDto>;
