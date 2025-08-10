namespace StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
public sealed record ShipmentDtoCollection
{
    public required IReadOnlyCollection<ShipmentDto> Data { get; init; } 
        = Array.Empty<ShipmentDto>();
}
