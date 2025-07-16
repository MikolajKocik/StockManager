using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models;

namespace StockManager.Infrastructure.DomainServices;

public sealed class InventoryItemService : IInventoryItemService
{
    public void AddStock(InventoryItem item, decimal amount)
    {
        if(amount <= 0)
        {
            throw new ArgumentException("Amount must be greater than zero");
        }

        item.QuantityOnHand += amount;
    }

    public void ReleaseReservation(InventoryItem item, decimal amount)
    {
        if (amount <= 0 || amount > item.QuantityReserved)
        {
            throw new InvalidOperationException("Bad amount to release");
        }

        item.QuantityReserved -= amount;
    }

    public void RemoveStock(InventoryItem item, decimal amount)
    {
        if (amount <= 0 || amount > item.QuantityAvailable)
        {
            throw new InvalidOperationException("Cannot remove the stock with provided amount");
        }

        item.QuantityOnHand -= amount;
    }

    public void Reserve(InventoryItem item, decimal amount)
    {
        if (amount <= 0 || amount > item.QuantityAvailable)
        {

            throw new InvalidOperationException("Cannot reserve with this value amount");
        }

        item.QuantityReserved += amount;
    }
}
