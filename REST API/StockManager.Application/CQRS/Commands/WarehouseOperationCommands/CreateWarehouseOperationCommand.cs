using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;
using StockManager.Core.Domain.Enums;

namespace StockManager.Application.CQRS.Commands.WarehouseOperationCommands;

public sealed record CreateWarehouseOperationCommand(
    OperationType Type,
    DateTime Date,
    string Description,
    List<OperationItemDto> Items
) : ICommand<WarehouseOperationDto>;
