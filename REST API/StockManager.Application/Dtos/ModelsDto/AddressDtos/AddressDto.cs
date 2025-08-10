namespace StockManager.Application.Dtos.ModelsDto.AddressDtos;

public sealed record AddressDto
{
    public Guid Id { get; init; }
    public required string City { get; init; }
    public required string Country { get; init; }
    public required string PostalCode { get; init; }
    public Guid SupplierId { get; init; }
}






