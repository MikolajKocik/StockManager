using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using MockQueryable;
using Moq;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Mappings.ProductProfile;
using StockManager.Application.Tests.TestHelpers.ProductFactory;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SupplierEntity;
using Xunit.Sdk;

namespace StockManager.Application.Tests;

public sealed class GetProductsQueryHandlerTests
{
    private readonly Mock<IProductRepository> _repository = new();
    private readonly Mock<IMapper> _mapper = new();

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

    [Fact]
    public async Task Handle_Should_Filter_By_Genre_And_Map()
    {
        //
        DateTime expirationDate = DateTime.Today.AddDays(7);
        Product product = ProductTestFactory.CreateTestProduct(expiration: expirationDate);

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
