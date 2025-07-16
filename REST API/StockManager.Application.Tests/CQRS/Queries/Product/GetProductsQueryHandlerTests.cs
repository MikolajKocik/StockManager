using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using MockQueryable;
using Moq;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Tests.TestHelpers.ProductFactory;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.Product;
using Xunit.Sdk;

namespace StockManager.Application.Tests;

public sealed class GetProductsQueryHandlerTests
{
    private readonly Mock<IMapper> _mapper = new();
    private readonly Mock<IProductRepository> _repository = new();
    private readonly GetProductsQueryHandler _handler;
    public GetProductsQueryHandlerTests()
    {
        _handler = new GetProductsQueryHandler(_mapper.Object, _repository.Object);
    }

    [Fact]
    public async Task Handle_Should_Return_Empty_Array_When_No_Match()
    {
        //
        var emptyList = new List<Product>();
        IQueryable<Product> mockQueryable = emptyList.AsQueryable().BuildMock();

        _repository
            .Setup(r => r.GetProducts())
            .Returns(mockQueryable);

        _mapper
            .Setup(m => m.Map<IEnumerable<ProductDto>>(It.IsAny<IEnumerable<Product>>()))
            .Returns(Enumerable.Empty<ProductDto>);

        var query = new GetProductsQuery(
            Name: null,
            Warehouse: null,
            Genre: null,
            Unit: null,
            ExpirationDate: null,
            DeliveredAt: null
            );

        //
        Result<IEnumerable<ProductDto>> result = await _handler.Handle(query, CancellationToken.None);

        //
        result.Value.Should().BeEmpty();
        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public async Task Handle_Should_Filter_By_Genre_And_Map()
    {
        //
        var products = new List<Product>
        {
            ProductTestFactory.CreateTestProduct()
        };
        IQueryable<Product> mockProducts = products.AsQueryable().BuildMock();

        _repository
            .Setup(r => r.GetProducts()).Returns(mockProducts);

        IEnumerable<ProductDto> expectedDto = new List<ProductDto>
        {
            ProductTestDtoFactory.CreateTestDto()
        }.AsEnumerable();
        
        _mapper
            .Setup(m => m.Map<IEnumerable<ProductDto>>(It.IsAny<IEnumerable<Product>>()))
            .Returns(expectedDto);

        var query = new GetProductsQuery(
            Name: null,
            Warehouse: null,
            Genre: Genre.Meat.ToString(),
            Unit: null,
            ExpirationDate: null,
            DeliveredAt: null
            );

        //
        Result<IEnumerable<ProductDto>> result = await _handler.Handle(query, CancellationToken.None);

        //
        var list = result.Value!.ToList();
        list.Should().NotBeNullOrEmpty();
        list.Should().BeEquivalentTo(expectedDto);
        list.Should().ContainSingle(Genre.Meat.ToString());
        result.IsSuccess.Should().BeTrue();
    }
}
