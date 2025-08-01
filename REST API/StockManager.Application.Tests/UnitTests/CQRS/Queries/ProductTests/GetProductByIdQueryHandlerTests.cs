using AutoMapper;
using FluentAssertions;
using FluentAssertions.Common;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configurations;
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

    /// <summary>
    /// Tests whether the <see cref="GetProductByIdQueryHandler"/> correctly returns a <see cref="ProductDto"/>  when a
    /// product exists in the repository.
    /// </summary>
    /// <remarks>This test verifies the behavior of the query handler by mocking dependencies such as the
    /// product repository,  caching service, and logger. It ensures that the handler successfully maps the retrieved
    /// product entity  to a <see cref="ProductDto"/> and returns a successful result.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task Handle_Should_Return_ProductDto_When_Products_Exists()
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

    /// <summary>
    /// Tests that the <see cref="GetProductByIdQueryHandler.Handle"/> method returns a failure result  when the
    /// specified product does not exist in the repository.
    /// </summary>
    /// <remarks>This test verifies that the handler correctly identifies the absence of a product and returns
    /// an appropriate error result with the error code "Product.NotFound".</remarks>
    /// <returns></returns>
    [Fact]
    public async Task Handle_Should_Return_Failure_When_Product_Does_Not_Exist()
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
