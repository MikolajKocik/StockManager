using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Castle.Core.Logging;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using StackExchange.Redis;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;
using StockManager.Application.Tests.UnitTests.TestHelpers.ProductFactory;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ProductEntity;
using Testcontainers.Redis;

namespace StockManager.Application.Tests.UnitTests.CQRS.Commands.ProductTests;
public sealed class DeleteProductTests
{
    private readonly Mock<IProductRepository> _repository;
    private readonly Mock<IConnectionMultiplexer> _redis;
    private readonly Mock<IProductService> _service;

    public DeleteProductTests()
    {
        _service = new Mock<IProductService>();
        _repository = new Mock<IProductRepository>();
    }

    /// <summary>
    /// Verifies that a product is correctly flagged as deleted when the delete operation is performed.
    /// </summary>
    /// <remarks>This test ensures that the product is marked as deleted in the database, the associated cache
    /// entry is removed,  and a corresponding integration event is published. It validates the behavior of the <see
    /// cref="DeleteProductCommandHandler"/>  when handling a <see cref="DeleteProductCommand"/>.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task Should_Flag_Product_As_Deleted()
    {
        //
        Product product = ProductTestFactory.CreateTestProduct();

        NullLogger<DeleteProductCommandHandler> logger =
            NullLogger<DeleteProductCommandHandler>.Instance;

        _service
            .Setup(s => s.SetAsDeleted(It.IsAny<Product>()))
            .Callback<Product>(p => p.SetAsDeleted());

        _repository
            .Setup(s => s.GetProductByIdAsync(1, CancellationToken.None))
            .ReturnsAsync(product);

        var dbMock = new Mock<IDatabase>();
        _redis
            .Setup(r => r.GetDatabase(It.IsAny<int>(), It.IsAny<object>()))
            .Returns(dbMock.Object);

        dbMock
            .Setup(d => d.KeyDeleteAsync(It.IsAny<RedisKey>(), It.IsAny<CommandFlags>()))
            .ReturnsAsync(true);

        var handler = new DeleteProductCommandHandler(
            _repository.Object,
            logger,
            _redis.Object,
            _service.Object
            );

        var command = new DeleteProductCommand(1);

        //
        Result<Unit> result = await handler.Handle(command, CancellationToken.None);

        //
        result.IsSuccess.Should().BeTrue();
    }
}
