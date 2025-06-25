using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;

namespace StockManager.Application.CQRS.Commands.ProductCommands.TrackProductView;

public class TrackProductViewCommandHandler : ICommandHandler<TrackProductViewCommand, Unit>
{
    private readonly IConnectionMultiplexer _redis;

    public TrackProductViewCommandHandler(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<Result<Unit>> Handle(TrackProductViewCommand command, CancellationToken ct)
    {
        IDatabase db = _redis.GetDatabase();
        string key = $"product:{command.ProductId}:views";

        // increment with 1 and return new
        long newCount = await db.StringIncrementAsync(key);

        if (newCount == 1)
        {
            await db.KeyExpireAsync(key, TimeSpan.FromHours(24));
        }

        return Result<Unit>.Success(Unit.Value);
    }
}
