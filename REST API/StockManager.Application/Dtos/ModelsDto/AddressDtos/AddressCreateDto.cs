namespace StockManager.Application.Dtos.ModelsDto.AddressDtos;

public sealed record AddressCreateDto
{
    public string City { get; init; }
    public string Country { get; init; }
    public string PostalCode { get; init; }
    public Guid SupplierId { get; init; }
}
