using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.Tests.CQRS.Queries.Supplier;

public sealed class GetSuppliersQueryHandlerTests
{
    private readonly Mock<ISupplierRepository> _repository = new();
    private readonly Mock<IMapper> _mapper = new();
    private readonly GetSuppliersQueryHandler _handler;

    public GetSuppliersQueryHandlerTests()
    {
        _handler = new GetSuppliersQueryHandler(
            _repository.Object,
            _mapper.Object);
    }
}
