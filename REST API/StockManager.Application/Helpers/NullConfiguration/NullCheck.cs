using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Helpers.NullConfiguration;

public static class NullCheck
{
    public static void IsConfigured(params object[] args)
    {
        foreach (object item in args)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(item.ToString());
        }
    }
}
