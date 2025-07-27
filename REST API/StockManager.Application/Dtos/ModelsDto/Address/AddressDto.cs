namespace StockManager.Application.Dtos.ModelsDto.Address;

public sealed record AddressDto
{
    public Guid Id { get;  }
    public string City { get; }
    public string Country { get; }
    public string PostalCode { get; }
    public Guid SupplierId { get; }
}






