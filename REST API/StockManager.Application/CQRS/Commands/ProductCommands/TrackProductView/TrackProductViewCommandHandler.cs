using MediatR;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.CQRS.NullResult;

namespace StockManager.Application.CQRS.Commands.ProductCommands.TrackProductView;

public sealed class TrackProductViewCommandHandler(IConnectionMultiplexer redis)
    : ICommandHandler<TrackProductViewCommand, Unit>
{
    private readonly IConnectionMultiplexer _redis = redis;

    public async Task<Result<Unit>> Handle(TrackProductViewCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.ProductId);

        string key = $"product:{command.ProductId}:views";

        await _redis.IncrementKeyAsync(
            key,
            TimeSpan.FromHours(24),
            ct);

        return Result<Unit>.Success(Unit.Value);
    }
}
