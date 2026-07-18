using System;

namespace StockManager.Application.Helpers.NullConfiguration;

public static class NullCheck
{
    /// <summary>
    /// Ensures that each provided argument is not null and, for strings, is not whitespace.
    /// </summary>
    /// <param name="args">Arguments to validate.</param>
    /// <exception cref="ArgumentException">Thrown when any argument is null or, if it is a string, empty/whitespace.</exception>
    public static void IsConfigured(params object?[] args)
    {
        foreach (object? item in args)
        {
            if (item is null)
            {
                throw new ArgumentException("Argument cannot be null.");
            }

            if (item is string value && string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("String argument cannot be null, empty, or whitespace.");
            }
        }
    }
}
