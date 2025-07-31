using AutoMapper;
using FluentAssertions;
using FluentAssertions.Common;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configuration;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Mappings.ProductProfile;
using StockManager.Application.Tests.UnitTests.TestHelpers.ProductFactory;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.Tests.UnitTests.CQRS.Queries.ProductTests;

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
    public async Task Handle_ShouldReturnProductDto_WhenProductsExists()
    {
        // 
        Core.Domain.Models.ProductEntity.
            Product? product = ProductTestFactory.CreateTestProduct();
        var query = new GetProductByIdQuery(1);

        // repo
        _productRepositoryMock
            .Setup(r => r.GetProductByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        ProductCreateDto expected = ProductTestDtoFactory.CreateTestDto();

        // mapper
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<ProductMappingProfile>();
        });
        mapperConfig.AssertConfigurationIsValid();
        IMapper realMapper = mapperConfig.CreateMapper();

        //caching
        _cache
            .Setup(c => c.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((byte[]?)null);
        _cacheOptions
            .Setup(o => o.Value)
            .Returns(new CacheSettings());

        // logger
        ILogger<GetProductByIdQueryHandler> logger = NullLogger<GetProductByIdQueryHandler>.Instance;


        var handler = new GetProductByIdQueryHandler(
            realMapper,
            _productRepositoryMock.Object,
            _cache.Object,
            _cacheOptions.Object,
            logger);

        // 
        Result<ProductDto> result = await handler.Handle(query, CancellationToken.None);

        // 
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEquivalentTo(expected, opts =>
            opts.Excluding(x => x.ExpirationDate)
            .Excluding(x => x.SupplierId));
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenProductDoesNotExist()
    {
        //
        var query = new GetProductByIdQuery(1);

        _productRepositoryMock
            .Setup(r => r.GetProductByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Core.Domain.Models.ProductEntity.Product?)null);

        //
        Result<ProductDto> result = await _handler.Handle(query, CancellationToken.None);

        //
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().NotBeNull();
        result.Error.Code.Should().Be("Product.NotFound");
    }
}
