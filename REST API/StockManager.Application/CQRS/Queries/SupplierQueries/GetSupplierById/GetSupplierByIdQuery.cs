using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.CQRS.Queries.SupplierQueries.GetSupplierById;

public sealed class GetSupplierByIdQuery : IQuery<SupplierDto>
{
    public Guid Id { get; set; }
    public GetSupplierByIdQuery(Guid id)
    {
        Id = id;
    }
}
