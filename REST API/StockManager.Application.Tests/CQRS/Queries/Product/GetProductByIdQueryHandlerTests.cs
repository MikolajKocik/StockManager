using AutoMapper;
using FluentAssertions;
using Moq;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Tests.TestHelpers.ProductFactory;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.Tests.CQRS.Queries.Product
{
    public sealed class GetProductByIdQueryHandlerTests
    {
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly GetProductByIdQueryHandler _handler;

        public GetProductByIdQueryHandlerTests()
        { 
            _productRepositoryMock = new Mock<IProductRepository>();
            _mapperMock = new Mock<IMapper>();
            _handler = new GetProductByIdQueryHandler(_mapperMock.Object, _productRepositoryMock.Object);
        }

        [Fact]
        public async Task Handle_ShouldReturnProductDto_WhenProductsEXists()
        {
            // 
            var product = ProductTestFactory.CreateTestProduct();
            var dto = ProductTestDtoFactory.CreateTestDto();
            var query = new GetProductByIdQuery(1);

            _productRepositoryMock
                .Setup(r => r.GetProductByIdAsync(1, It.IsAny<CancellationToken>()))
                .ReturnsAsync(product);

            _mapperMock
                .Setup(m => m.Map<ProductDto>(product))
                .Returns(dto);
            
            //
            var result = await _handler.Handle(query, CancellationToken.None);

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
                .ReturnsAsync((Models.Product?)null);

            //
            var result = await _handler.Handle(query, CancellationToken.None);

            //
            result.IsSuccess.Should().BeFalse();
            result.Error.Should().NotBeNull();
            result.Error.Code.Should().Be("Product.NotFound");
        }

        [Fact]
        public async Task Handle_ShouldThrow_WhenCancellationRequested()
        {
            //
            var query = new GetProductByIdQuery(1);
            var cts = new CancellationTokenSource();
            cts.Cancel();

            //
            var act = async () => await _handler.Handle(query, cts.Token);

            //
            await act.Should().ThrowAsync<OperationCanceledException>();
        }
    }
}
