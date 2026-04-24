using FluentAssertions;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using TestHelpers.ProductFactory;

namespace StockManager.Application.Tests.UnitTests.Common.CancellationToken;

public sealed class TrackingBehaviorTests
{
    private readonly Mock<IEnumerable<IValidator<AddProductCommand>>> _validators;
    private readonly Mock<IBaseRepository> _baseRepository;

    public TrackingBehaviorTests()
    {
        _validators = new Mock<IEnumerable<IValidator<AddProductCommand>>>();
        _baseRepository = new Mock<IBaseRepository>();
    }

    /// <summary>
    /// Verifies that the <see cref="TrackingBehavior{TRequest, TResponse}.Handle"/> method throws an  <see
    /// cref="OperationCanceledException"/> when a cancellation is requested via the provided <see
    /// cref="CancellationToken"/>.
    /// </summary>
    /// <remarks>This test ensures that the behavior correctly respects the cancellation token and halts
    /// execution  when a cancellation is signaled. It uses a mock setup for validators and a test command to simulate 
    /// the scenario.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task Handle_Should_Throw_When_Cancellation_Requested()
    {   
        //
        _validators.Setup(v => v.GetEnumerator())
            .Returns(Enumerable.Empty<IValidator<AddProductCommand>>().GetEnumerator());

        NullLogger<TrackingBehavior<AddProductCommand, Result<ProductDto>>> logger = 
            NullLogger<TrackingBehavior<AddProductCommand, Result<ProductDto>>>.Instance;

        var behavior = new TrackingBehavior<AddProductCommand, Result<ProductDto>>(
            logger, _validators.Object, _baseRepository.Object
            );

        using var cancellationToken = new CancellationTokenSource();
        await cancellationToken.CancelAsync();

        ProductCreateDto data = ProductTestDtoFactory.CreateTestDto();
        var command = new AddProductCommand(data);
        var productDto = new ProductDto 
        { 
            Id = 1, 
            Name = data.Name, 
            Slug = "test-slug",
            Genre = "test-genre",
            Unit = "test-unit",
            Type = "test-type",
            BatchNumber = "test-batch"
        };

        //
        var next = new RequestHandlerDelegate<Result<ProductDto>>(() => Task.FromResult(Result<ProductDto>.Success(productDto)));

        Func<Task> act = async () => await behavior.Handle(command, next, cancellationToken.Token);

        //
        await act.Should().ThrowAsync<OperationCanceledException>();
    }
}
