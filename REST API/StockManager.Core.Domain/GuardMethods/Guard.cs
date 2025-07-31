using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.GuardMethods;

internal static class Guard
{
    /// <summary>
    /// Validates that none of the provided string values are null, empty, or consist only of white-space characters.
    /// </summary>
    /// <param name="values">An array of strings to validate. Each string must not be null, empty, or white-space only.</param>
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

    /// <summary>
    /// Ensures that the specified value is not its default value (e.g., 0 for numeric types or <see cref="Guid.Empty"/>
    /// for <see cref="Guid"/>) if it is provided.
    /// </summary>
    /// <typeparam name="T">The value type of the parameter being validated. Must be a non-nullable value type.</typeparam>
    /// <param name="value">The value to validate. If <see langword="null"/>, no validation is performed.</param>
    /// <param name="paramName">The name of the parameter being validated. Used in the exception message if validation fails. Defaults to the
    /// name of the <paramref name="value"/> parameter.</param>
    /// <exception cref="ArgumentException">Thrown if <paramref name="value"/> is not <see langword="null"/> and is equal to its default value (e.g., 0 for
    /// numeric types or <see cref="Guid.Empty"/> for <see cref="Guid"/>).</exception>
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

    /// <summary>
    /// Ensures that none of the provided values are null.
    /// </summary>
    /// <remarks>This method is typically used to validate that required reference-type arguments are not
    /// null.</remarks>
    /// <typeparam name="T">The type of the values to check. Must be a reference type.</typeparam>
    /// <param name="values">An array of values to validate. Each value must not be null.</param>
    public static void AgainstNull<T>(params T[] values) where T : class
    {
        foreach (T value in values)
        {
            ArgumentNullException.ThrowIfNull(value, "Provided value cannot be empty");
        }
    }

    /// <summary>
    /// Validates that the specified <paramref name="timestamp"/> is not the default value and does not represent a
    /// future date.
    /// </summary>
    /// <param name="timestamp">The date and time value to validate. Must not be the default value and must not be in the future.</param>
    /// <param name="paramName">An optional parameter name to include in the exception message if validation fails.  If not provided, the
    /// default parameter name will be used.</param>
    /// <exception cref="ArgumentException">Thrown if <paramref name="timestamp"/> represents a future date. Thrown if <paramref name="timestamp"/> is the
    /// default value for <see cref="DateTime"/>.</exception>
    public static void IsValidDate(DateTime timestamp, string? paramName = null)
    {
        AgainstDefaultValue(timestamp);

        if (timestamp > DateTime.UtcNow)
        {
            throw new ArgumentException("Timestamp cannot be in the future", nameof(timestamp));
        }
    }

    /// <summary>
    /// Validates an optional <see cref="DateTime"/> value and ensures it meets specific conditions if provided.
    /// </summary>
    /// <remarks>If the <paramref name="date"/> parameter has a value, it is checked to ensure it is a valid
    /// date. If <paramref name="date"/> is <see langword="null"/>, the method performs no validation.</remarks>
    /// <param name="date">The optional <see cref="DateTime"/> value to validate. If <see langword="null"/>, no validation is performed.</param>
    /// <param name="paramName">The name of the parameter being validated. Used for error reporting if validation fails. This value can be <see
    /// langword="null"/>.</param>
    private static void RequireOptionalDate(DateTime? date, string? paramName = null)
    {
        AgainstDefaultValueIfProvided(date, nameof(paramName));

        if (date.HasValue)
        {
            IsValidDate(date.Value);
        }
    }

    /// <summary>
    /// Sets an optional date value and invokes the specified action with the provided date.
    /// </summary>
    /// <remarks>If <paramref name="date"/> has a value, it is validated before invoking the action. If the
    /// validation fails, an exception is thrown.</remarks>
    /// <param name="date">The optional <see cref="DateTime"/> value to be processed. Can be <see langword="null"/>.</param>
    /// <param name="action">The action to invoke with the <paramref name="date"/> value. If <paramref name="date"/> is <see
    /// langword="null"/>, the action is invoked with <see langword="null"/>.</param>
    /// <param name="paramName">The name of the parameter being validated, used for error reporting if <paramref name="date"/> is invalid. Can
    /// be <see langword="null"/>.</param>
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

    /// <summary>
    /// Validates that all specified decimal values are greater than zero.
    /// </summary>
    /// <param name="values">An array of decimal values to validate. Each value must be greater than zero.</param>
    /// <exception cref="ArgumentException">Thrown if any value in <paramref name="values"/> is less than or equal to zero.</exception>
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
