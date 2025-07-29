using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;

namespace StockManager.Controllers;
public sealed class StockTransactionDtoCollection
{
    public IEnumerable<StockTransactionDto> Data { get; set; }
}
