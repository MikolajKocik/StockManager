using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;

namespace StockManager.Application.CQRS.Commands.CustomerCommands.AddCustomer;

public sealed record AddCustomerCommand(
    CustomerCreateDto CreateDto
    ) : ICommand<CustomerDto>;
