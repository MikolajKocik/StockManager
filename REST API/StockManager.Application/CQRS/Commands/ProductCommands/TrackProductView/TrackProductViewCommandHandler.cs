using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.CQRS.NullResult;

namespace StockManager.Application.CQRS.Commands.ProductCommands.TrackProductView;

public class TrackProductViewCommandHandler : ICommandHandler<TrackProductViewCommand, Unit>
{
    private readonly IConnectionMultiplexer _redis;

    public TrackProductViewCommandHandler(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<Result<Unit>> Handle(TrackProductViewCommand command, CancellationToken cancellationToken)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.ProductId);

        string key = $"product:{command.ProductId}:views";

        await _redis.IncrementKeyAsync(
            key,
            TimeSpan.FromHours(24),
            cancellationToken)
            .ConfigureAwait(false);

        return Result<Unit>.Success(Unit.Value);
    }
}
