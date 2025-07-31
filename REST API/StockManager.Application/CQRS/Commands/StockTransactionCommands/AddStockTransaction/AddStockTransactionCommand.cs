using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;

namespace StockManager.Application.CQRS.Commands.StockTransactionCommands.AddStockTransaction;

public sealed record AddStockTransactionCommand(
    StockTransactionCreateDto CreateDto
    ) : ICommand<StockTransactionDto>;
