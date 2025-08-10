using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;

namespace StockManager.Controllers;
public sealed record StockTransactionDtoCollection
{
    public required IReadOnlyCollection<StockTransactionDto> Data { get; init; }
        = Array.Empty<StockTransactionDto>();
}
