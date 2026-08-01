using FluentAssertions;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Middlewares;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Tests.UnitTests.Common.CancellationToken;

public sealed class TrackingBehaviorTests
{
    private readonly Mock<IUnitOfWork> _uow;

    public TrackingBehaviorTests()
    {
        _uow = new Mock<IUnitOfWork>();
    }

    public class TestRequest : IRequest, IBaseCommand { }

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
        NullLogger<TrackingBehavior<TestRequest, Unit>> logger =
            NullLogger<TrackingBehavior<TestRequest, Unit>>.Instance;

        var validatorsMock = new Mock<IEnumerable<IValidator<TestRequest>>>();
        validatorsMock.Setup(v => v.GetEnumerator())
            .Returns(Enumerable.Empty<IValidator<TestRequest>>().GetEnumerator());

        var behavior = new TrackingBehavior<TestRequest, Unit>(
            logger, validatorsMock.Object, _uow.Object
            );

        using var cancellationToken = new CancellationTokenSource();
        await cancellationToken.CancelAsync();

        var command = new TestRequest();

        //
        var next = new RequestHandlerDelegate<Unit>(() => Task.FromResult(Unit.Value));

        Func<Task> act = async () => await behavior.Handle(command, next, cancellationToken.Token);

        //
        await act.Should().ThrowAsync<OperationCanceledException>();
    }
}
