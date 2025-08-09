using FluentAssertions;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using TestHelpers.ProductFactory;

namespace StockManager.Application.Tests.UnitTests.Common.CancellationToken;

public sealed class TrackingBehaviorTests
{
    private readonly Mock<IEnumerable<IValidator<GetProductByIdQuery>>> _validators;
    private readonly Mock<IBaseRepository> _baseRepository;

    public TrackingBehaviorTests()
    {
        _validators = new Mock<IEnumerable<IValidator<GetProductByIdQuery>>>();
        _baseRepository = new Mock<IBaseRepository>();
    }

    /// <summary>
    /// Verifies that the <see cref="TrackingBehavior{TRequest, TResponse}.Handle"/> method throws an  <see
    /// cref="OperationCanceledException"/> when a cancellation is requested via the provided <see
    /// cref="CancellationToken"/>.
    /// </summary>
    /// <remarks>This test ensures that the behavior correctly respects the cancellation token and halts
    /// execution  when a cancellation is signaled. It uses a mock setup for validators and a test query to simulate 
    /// the scenario.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task Handle_Should_Throw_When_Cancellation_Requested()
    {   
        //
        _validators.Setup(v => v.GetEnumerator())
            .Returns(Enumerable.Empty<IValidator<GetProductByIdQuery>>().GetEnumerator());

        NullLogger<TrackingBehavior<GetProductByIdQuery, Result<ProductCreateDto>>> logger = 
            NullLogger<TrackingBehavior<GetProductByIdQuery, Result<ProductCreateDto>>>.Instance;

        var behavior = new TrackingBehavior<GetProductByIdQuery, Result<ProductCreateDto>>(
            logger, _validators.Object, _baseRepository.Object
            );

        using var cancellationToken = new CancellationTokenSource();
        await cancellationToken.CancelAsync();

        var query = new GetProductByIdQuery(1);
        ProductCreateDto data = ProductTestDtoFactory.CreateTestDto();

        //
        var next = new RequestHandlerDelegate<Result<ProductCreateDto>>(() => Task.FromResult(Result<ProductCreateDto>.Success(data)));

        Func<Task> act = async () => await behavior.Handle(query, next, cancellationToken.Token);

        //
        await act.Should().ThrowAsync<OperationCanceledException>();
    }
}
