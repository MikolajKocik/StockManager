namespace StockManager.Application.Dtos.ModelsDto.AddressDtos;

public sealed record AddressDto
{
    public Guid Id { get; init; }
    public string City { get; init; }
    public string Country { get; init; }
    public string PostalCode { get; init; }
    public Guid SupplierId { get; init; }
}






