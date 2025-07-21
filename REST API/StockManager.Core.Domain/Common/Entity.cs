using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Common;

public abstract class Entity<TId> where TId : IEquatable<TId>
{
    public TId Id { get; protected set; }

    protected Entity() { }

    protected Entity(TId id)
    {
        if(id is null || id.Equals(default))
        {
            throw new ArgumentException($"Id cannot be default value for type {typeof(TId).Name}", nameof(id));
        }

        Id = id;
    }

    /// <summary>
    /// Determines whether the specified object is equal to the current entity based on its unique identity.
    /// </summary>
    /// <param name="obj">The object to compare with the current entity.</param>
    /// <returns><c>true</c> if the specified object is equal to the current entity; otherwise, <c>false</c>.</returns>
    /// <remarks>
    /// <para>
    /// This method overrides the default <see cref="object.Equals(object)"/> to define equality for domain entities.
    /// Two entities are considered equal if they are of the exact same runtime type and share the same unique identifier (ID).
    /// </para>
    /// <para>
    /// For clarity regarding type comparison within this method:
    /// <list type="bullet">
    ///     <item><term><c>obj.GetType()</c></term><description>Returns the exact runtime type of the object passed as the <paramref name="obj"/> parameter.</description></item>
    ///     <item><term><c>GetType()</c></term><description>Returns the exact runtime type of the current instance on which this method is being called.</description></item>
    /// </list>
    /// This strict type comparison is crucial for maintaining proper entity identity within a domain-driven design context, ensuring that entities of different precise types are not considered equal, even if they share the same ID.
    /// </para>
    /// </remarks>
    public override bool Equals(object? obj)
    {
        if (obj is null || obj.GetType() != GetType())
        {
            return false;
        }

        var entity = (Entity<TId>)obj;

        return Id.Equals(entity.Id);
    }

    public override int GetHashCode()
    {
        return Id is null ? 0 : Id.GetHashCode();
    }

    /// <summary>
    /// Overloads the equality operator (==) for comparing two entities.
    /// </summary>
    /// <param name="left">The left-hand side entity for comparison.</param>
    /// <param name="right">The right-hand side entity for comparison.</param>
    /// <returns><c>true</c> if the two entities are considered equal; otherwise, <c>false</c>.</returns>
    /// <remarks>
    /// This operator is overloaded to provide custom equality logic for entities, aligning with Domain-Driven Design principles.
    /// Two entities are considered equal if they are of the exact same runtime type and share the same unique identifier (ID).
    /// This allows for intuitive and consistent comparisons (e.g., <c>if (product1 == product2)</c>) throughout the application,
    /// automatically deferring to the entity's defined identity for equality checks.
    /// </remarks>
    public static bool operator ==(Entity<TId>? left, Entity<TId>? right)
    {
        if(left is null)
        { 
            return right is null;
        }

        return left.Equals(right);
    }

    public static bool operator !=(Entity<TId>? left, Entity<TId>? right)
        => !(left == right);
}
