using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Helpers.NullConfiguration;

public static class NullCheck
{
    /// <summary>
    /// Determines whether all provided arguments are non-null and contain non-whitespace string representations.
    /// </summary>
    /// <param name="args">An array of objects to validate. Each object's string representation must be non-null and non-whitespace.</param>
    public static void IsConfigured(params object[] args)
    {
        foreach (object item in args)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(item.ToString());
        }
    }
}
