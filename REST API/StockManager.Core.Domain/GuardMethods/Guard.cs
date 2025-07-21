using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.GuardMethods;

internal static class Guard
{
    public static void AgainstNullOrWhiteSpace(params string[] values)
    {
        foreach (string value in values)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(value, "A provided field");
        }
    }

    /// <summary>
    /// Checks if any provided struct value is its default (empty) value.
    /// </summary>
    /// <remarks>
    /// This method is for validating value types (structs) like <see cref="System.Guid"/> (<see langword="Guid.Empty"/>)
    /// or numeric types where zero is not allowed. Structs can't be <see langword="null"/>, so this acts as their "null check."
    /// </remarks>
    /// <typeparam name="T">The struct type to check; must implement <see cref="System.IEquatable{T}"/>.</typeparam>
    /// <param name="values">An array of struct values to verify. An exception is thrown if any value is its default.</param>
    /// <exception cref="System.ArgumentException">Thrown if a value is its default.</exception>
    /// <exception cref="System.ArgumentNullException">Thrown if the <paramref name="values"/> array itself is <see langword="null"/>.</exception>
    public static void AgainstDefaultValue<T>(params T[] values) where T : struct, IEquatable<T>
    {
        foreach (T value in values)
        {
            if (Equals(value, default(T)))
            {
                throw new ArgumentException("A provided field cannot be its default value.", value.ToString());
            }
        }
    }

    public static void AgainstDefaultValueIfProvided<T>(T? value, string? paramName = null) where T : struct
    {
        if (value is null)
        {
            return;
        }

        T actualValue = value.Value;

        var defaultValue = default(T);

        if (EqualityComparer<T>.Default.Equals(actualValue, defaultValue))
        {
            throw new ArgumentException(
                $"Parameter '{paramName ?? nameof(value)}' cannot be its default value (e.g., 0 or Guid.Empty) when provided.",
                paramName ?? nameof(value));

        }
    }

    public static void AgainstNull<T>(params T[] values) where T : class
    {
        foreach (T value in values)
        {
            ArgumentNullException.ThrowIfNull(value, "Provided value cannot be empty");
        }
    }

    public static void IsValidDate(DateTime timestamp, string? paramName = null)
    {
        AgainstDefaultValue(timestamp);

        if (timestamp > DateTime.UtcNow)
        {
            throw new ArgumentException("Timestamp cannot be in the future", nameof(timestamp));
        }
    }

    private static void RequireOptionalDate(DateTime? date, string? paramName = null)
    {
        AgainstDefaultValueIfProvided(date, nameof(paramName));

        if (date.HasValue)
        {
            IsValidDate(date.Value);
        }
    }

    public static void SetOptionalDate(
       DateTime? date,
       Action<DateTime?> action,
       string? paramName = null)
    {
        if (date.HasValue)
        {
            RequireOptionalDate(date, paramName);
            action(date);
        }
        else
        {
            action(null);
        }
    }

    /// <summary>
    /// Checks if the provided enum value is a valid defined member of its enumeration type.
    /// This is particularly useful to prevent invalid integer values from being cast to an enum type
    /// or to ensure the default/zero value is not used if it's considered invalid for the context.
    /// </summary>
    /// <typeparam name="TEnum">The enumeration type to check. Must be an unmanaged type (e.g., enum).</typeparam>
    /// <param name="value">The enum value to validate.</param>
    /// <exception cref="System.ArgumentException">Thrown if the provided enum value is not a valid defined member of its type.</exception>
    public static void AgainstInvalidEnumValue<TEnum>(TEnum value) where TEnum : struct, Enum 
    {
        if (!Enum.IsDefined(typeof(TEnum), value))
        {
            throw new ArgumentException(
                $"The value '{value}' is not a valid defined member of the {typeof(TEnum).Name} enumeration.");
        }
    }

    public static void DecimalValueGreaterThanZero(params decimal[] values)
    {
        foreach (decimal value in values)
        {
            if (value <= 0)
            {
                throw new ArgumentException("Value must be positive");
            }
        }
    }
}
