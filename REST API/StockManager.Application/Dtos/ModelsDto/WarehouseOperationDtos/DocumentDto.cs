namespace StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;

public class DocumentDto
{
    public int Id { get; set; }
    public int OperationId { get; set; }
    public string DocumentNumber { get; set; }
    public string FileUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
