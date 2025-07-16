using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Product;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.Common.Logging.Product;

public static class ProductLogWarning
{
    public static readonly Action<ILogger, int, Exception?> LogProductNotFound =
       LoggerMessage.Define<int>(
           LogLevel.Warning,
           ProductLogEventIds.ProductNotFound,
           "Product with id:{ProductId} not found. Rolling back transaction");

    public static readonly Action<ILogger, ProductDto, Exception?> LogProductValidationFailed =
        LoggerMessage.Define<ProductDto>(
            LogLevel.Warning,
            ProductLogEventIds.ProductValidationFailed,
            "Validation failed for {Product}. Rolling back transaction");

    public static readonly Action<ILogger, Core.Domain.Models.Product.Product, string, Exception?> LogProductValidationFailedExtended =
        LoggerMessage.Define<Core.Domain.Models.Product.Product, string>(
            LogLevel.Warning,
            ProductLogEventIds.ProductValidationFailedExtended,
            "Validation failed for product:{@product}. Errors: {Errors}. Rolling back transaction");
}
