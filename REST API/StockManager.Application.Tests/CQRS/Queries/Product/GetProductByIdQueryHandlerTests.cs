using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configuration;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Tests.TestHelpers.ProductFactory;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.Tests.CQRS.Queries.Product;

public sealed class GetProductByIdQueryHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IDistributedCache> _cache;
    private readonly GetProductByIdQueryHandler _handler;
    private readonly Mock<IOptions<CacheSettings>> _cacheOptions;

    public GetProductByIdQueryHandlerTests()
    { 
        _productRepositoryMock = new Mock<IProductRepository>();
        _mapperMock = new Mock<IMapper>();
        _cache = new Mock<IDistributedCache>();
        _cacheOptions = new Mock<IOptions<CacheSettings>>();
        ILogger<GetProductByIdQueryHandler> logger = NullLogger<GetProductByIdQueryHandler>.Instance;
        _handler = new GetProductByIdQueryHandler(
            _mapperMock.Object,
            _productRepositoryMock.Object,
            _cache.Object,
            _cacheOptions.Object,
            logger);
    }

    [Fact]
    public async Task Handle_ShouldReturnProductDto_WhenProductsEXists()
    {
        // 
        Core.Domain.Models.Product.Product? product = ProductTestFactory.CreateTestProduct();
        ProductDto? dto = ProductTestDtoFactory.CreateTestDto();
        var query = new GetProductByIdQuery(1);

        _productRepositoryMock
            .Setup(r => r.GetProductByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        _mapperMock
            .Setup(m => m.Map<ProductDto>(product))
            .Returns(dto);
        
        //
        Result<ProductDto> result = await _handler.Handle(query, CancellationToken.None);

        //
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEquivalentTo(dto);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenProductDoesNotExist()
    {
        //
        var query = new GetProductByIdQuery(1);

        _productRepositoryMock
            .Setup(r => r.GetProductByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Core.Domain.Models.Product.Product?)null);

        //
        Result<ProductDto> result = await _handler.Handle(query, CancellationToken.None);

        //
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().NotBeNull();
        result.Error.Code.Should().Be("Product.NotFound");
    }
}
