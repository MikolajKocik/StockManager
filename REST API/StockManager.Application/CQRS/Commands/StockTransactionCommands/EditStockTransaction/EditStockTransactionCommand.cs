using System.Windows.Input;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;

namespace StockManager.Application.CQRS.Commands.StockTransactionCommands.EditStockTransaction;

public sealed record EditStockTransactionCommand(
    int Id,
    StockTransactionUpdateDto UpdateDto
    ) : ICommand<Unit>;
