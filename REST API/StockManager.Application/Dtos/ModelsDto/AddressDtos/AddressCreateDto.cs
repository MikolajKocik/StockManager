namespace StockManager.Application.Dtos.ModelsDto.AddressDtos;

public sealed record AddressCreateDto
{
    public required string City { get; init; }
    public required string Country { get; init; }
    public required string PostalCode { get; init; }
    public required Guid SupplierId { get; init; }
}
