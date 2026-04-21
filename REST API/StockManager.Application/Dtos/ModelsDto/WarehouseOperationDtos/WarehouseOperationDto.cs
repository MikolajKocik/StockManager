using StockManager.Core.Domain.Enums;

namespace StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;

public class WarehouseOperationDto
{
    public int Id { get; set; }
    public OperationType Type { get; set; }
    public OperationStatus Status { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    public List<OperationItemDto> Items { get; set; } = new();
}

public class OperationItemDto
{
    public int ProductId { get; set; }
    public decimal Quantity { get; set; }
}
