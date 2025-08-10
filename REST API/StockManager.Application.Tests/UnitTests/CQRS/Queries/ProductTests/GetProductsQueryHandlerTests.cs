using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using MockQueryable;
using Moq;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Mappings.ProductProfile;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SupplierEntity;
using TestHelpers.ProductFactory;
using Xunit.Sdk;

namespace StockManager.Application.Tests.UnitTests.CQRS.Queries.ProductTests;

public sealed class GetProductsQueryHandlerTests
{
    private readonly Mock<IProductRepository> _repository = new();
    private readonly Mock<IMapper> _mapper = new();

    /// <summary>
    /// Verifies that the <see cref="GetProductsQueryHandler"/> returns an empty array when no products match the query
    /// criteria.
    /// </summary>
    /// <remarks>This test ensures that the handler correctly handles scenarios where the product repository
    /// contains no matching products and returns an empty result set. It also validates that the operation is marked as
    /// successful.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task Handle_Should_Return_Empty_Array_When_No_Match()
    {
        //
        var emptyList = new List<Product>();
        IQueryable<Product> mockQueryable = emptyList.AsQueryable().BuildMock(); 

        _repository
            .Setup(r => r.GetProducts())
            .Returns(mockQueryable);

        _mapper.Setup(m => m.ConfigurationProvider)
            .Returns(new MapperConfiguration(cfg => cfg.AddProfile<ProductMappingProfile>()));

        // IQueryable BuildMock does not support ProjectTo<>
        // so we have to make mock in this way
        _mapper.Setup(m => m.ProjectTo<ProductDto>(It.IsAny<IQueryable<Product>>(), It.IsAny<IConfigurationProvider>(), null, null))
            .Returns(new List<ProductDto>()
            .AsQueryable());

        var handler = new GetProductsQueryHandler(_mapper.Object, _repository.Object);

        var query = new GetProductsQuery(
            Name: null,
            Warehouse: null,
            Genre: null,
            Unit: null,
            ExpirationDate: null,
            DeliveredAt: null
            );

        //
        Result<IEnumerable<ProductDto>> result = await handler.Handle(query, CancellationToken.None);

        //
        result.Value.Should().BeEmpty();
        result.IsSuccess.Should().BeTrue();
    }

    /// <summary>
    /// Tests the <see cref="GetProductsQueryHandler"/> to ensure it filters products by genre and maps them to the
    /// expected DTOs.
    /// </summary>
    /// <remarks>This test verifies that the query handler correctly applies the genre filter specified in the
    /// query and maps the resulting products to <see cref="ProductDto"/> objects using the configured mapping profile.
    /// It also ensures the result is successful and matches the expected output.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task Handle_Should_Filter_By_Genre_And_Map()
    {
        //
        DateTime expirationDate = DateTime.Today.AddDays(7);
        Product product = ProductTestFactory.CreateTestProduct(expiration: expirationDate);

        // here we set the date to product by bussiness mocked method from service
        // because entity uses hermetization with priavate fields
        var mockService = new Mock<IProductService>();
        mockService
            .Setup(s => s.SetExpirationDateForTest(It.IsAny<Product>()))
                .Callback<Product>(p => p.SetExpirationDateForTest(p));

        var products = new List<Product>
        {
            product
        };
        IQueryable<Product> mockProducts = products.AsQueryable().BuildMock();

        _repository
            .Setup(r => r.GetProducts()).Returns(mockProducts.AsQueryable());

        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<ProductMappingProfile>();
        });
        IMapper mapper = mapperConfig.CreateMapper();

        IEnumerable<ProductDto> expectedDto = mapper.Map<IEnumerable<ProductDto>>(products);

        var handler = new GetProductsQueryHandler(mapper, _repository.Object);

        var query = new GetProductsQuery(
            Name: null,
            Warehouse: null,
            Genre: Genre.Meat.ToString(),
            Unit: null,
            ExpirationDate: null,
            DeliveredAt: null
            );

        //
        Result<IEnumerable<ProductDto>> result = await handler.Handle(query, CancellationToken.None);

        //
        var list = result.Value!.ToList();
        list.Should().NotBeNullOrEmpty();
        list.Should().BeEquivalentTo(expectedDto);
        result.IsSuccess.Should().BeTrue();
    }
}
