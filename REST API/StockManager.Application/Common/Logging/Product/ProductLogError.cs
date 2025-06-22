using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Product;

namespace StockManager.Application.Common.Logging.Product;

public static class ProductLogError
{
    public static readonly Action<ILogger, Exception?> LogEditingProductException =
   LoggerMessage.Define(
       LogLevel.Error,
       ProductLogEventIds.EditingProductException,
       "Error occured while editing data");

    public static readonly Action<ILogger, Exception?> LogRemovingProductException =
      LoggerMessage.Define(
          LogLevel.Error,
          ProductLogEventIds.RemovingProductException,
          "Error occured while removing product");
}
