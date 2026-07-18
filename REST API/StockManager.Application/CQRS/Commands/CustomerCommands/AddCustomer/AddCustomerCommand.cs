using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;

namespace StockManager.Application.CQRS.Commands.CustomerCommands.AddCustomer;

public sealed record AddCustomerCommand(
    CustomerCreateDto CreateDto
    ) : ICommand<CustomerDto>;
