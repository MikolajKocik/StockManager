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

public class TrackProductViewCommand : ICommand<Unit>
{
    public Guid ProductId { get; }

    public TrackProductViewCommand(Guid productId)
    {
        ProductId = productId;
    }
}
