using MediatR;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;

namespace StockManager.Application.CQRS.Queries.DocumentQueries;

public sealed record GetDocumentsQuery : IQuery<List<DocumentDto>>;
