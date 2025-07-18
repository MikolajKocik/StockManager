using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.GuardMethods;

namespace StockManager.Core.Domain.Models.InventoryItemEntity;

public sealed partial class InventoryItem
{
    /// <summary>
    /// Increases the quantity on hand for this inventory item.
    /// </summary>
    /// <param name="amount">The amount to add. Must be positive.</param>
    /// <exception cref="ArgumentException">Thrown if the amount is negative or results in an invalid state.</exception>
    public void IncreaseQuantity(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Amount to increase must be positive.", nameof(amount));
        }
        // Validate that the new quantity doesn't lead to issues (e.g., negative after some other operation, though unlikely here)
        // You might consider a Guard.AgainstNegative(amount) here if you add such a method.
        QuantityOnHand += amount;
    }

    /// <summary>
    /// Decreases the quantity on hand for this inventory item.
    /// </summary>
    /// <param name="amount">The amount to remove. Must be positive.</param>
    /// <exception cref="ArgumentException">Thrown if the amount is negative, or if it would make quantity on hand negative,
    /// or if it would make quantity on hand less than quantity reserved.</exception>
    public void DecreaseQuantity(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Amount to decrease must be positive.", nameof(amount));
        }
        // Ensure we don't go below zero or below reserved quantity
        if (QuantityOnHand - amount < QuantityReserved)
        {
            throw new ArgumentException("Cannot decrease quantity below reserved amount or into negative.", nameof(amount));
        }
        QuantityOnHand -= amount;
    }

    /// <summary>
    /// Reserves a specific quantity of this inventory item.
    /// </summary>
    /// <param name="amount">The amount to reserve. Must be positive.</param>
    /// <exception cref="ArgumentException">Thrown if the amount is negative or if it exceeds available quantity.</exception>
    public void ReserveQuantity(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Amount to reserve must be positive.", nameof(amount));
        }
        if (QuantityAvailable < amount)
        {
            throw new ArgumentException("Cannot reserve more than available quantity.", nameof(amount));
        }
        QuantityReserved += amount;
    }

    /// <summary>
    /// Releases a previously reserved quantity of this inventory item.
    /// </summary>
    /// <param name="amount">The amount to release. Must be positive.</param>
    /// <exception cref="ArgumentException">Thrown if the amount is negative or if it exceeds the reserved quantity.</exception>
    public void ReleaseQuantity(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Amount to release must be positive.", nameof(amount));
        }
        if (QuantityReserved < amount)
        {
            throw new ArgumentException("Cannot release more than reserved quantity.", nameof(amount));
        }
        QuantityReserved -= amount;
    }

    /// <summary>
    /// Assigns the inventory item to a different bin location.
    /// </summary>
    /// <param name="newBinLocationId">The ID of the new bin location.</param>
    /// <exception cref="ArgumentException">Thrown if the new bin location ID is its default value.</exception>
    public void AssignToBinLocation(int newBinLocationId)
    {
        Guard.AgainstDefaultValue(newBinLocationId);
        BinLocationId = newBinLocationId;
    }
}
