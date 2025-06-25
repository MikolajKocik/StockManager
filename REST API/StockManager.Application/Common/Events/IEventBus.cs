using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Common.Events;

/// <summary>
/// Intermediate abstraction in the Integration Events publishing.
/// </summary>
public interface IEventBus
{
    /// <summary>
    /// Publicies like a type of event <typeparamref name="TEvent"/>.
    /// </summary>
    Task PublishAsync<TEvent>(TEvent @event)
        where TEvent : IIntegrationEvent;
}
