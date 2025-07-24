using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Product;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.Common.Logging.Product;
public static class ProductLogInfo 
{
    public static readonly Action<ILogger, int, string, Exception?> LogAddProductSuccesfull =
        LoggerMessage.Define<int, string>(
            LogLevel.Information,
            ProductLogEventIds.AddProductSuccesfull,
            "A new product id: {Id} with name: {Product} added to database");

    public static readonly Action<ILogger, int, Exception?> LogRemovingProductOperation =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            ProductLogEventIds.RemovingProductOperation,
            "Removing the provided product:{@product}");

    public static readonly Action<ILogger, int, ProductDto, Exception?> LogModyfingProduct =
        LoggerMessage.Define<int, ProductDto>(
            LogLevel.Information,
            ProductLogEventIds.ModyfingProduct,
            "Modifying the provided product:{@productId} with {@modifiedProduct}");

    public static readonly Action<ILogger, Result<IEnumerable<ProductDto>>, Exception?> LogReturningListOfProductSuccessfull =
        LoggerMessage.Define<Result<IEnumerable<ProductDto>>>(
            LogLevel.Information,
            ProductLogEventIds.ReturningListOfProductSuccessfull,
            "Succesfully returns a list of products: {Products}");

    public static readonly Action<ILogger, int, Exception?> LogProductFoundSuccess =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            ProductLogEventIds.ProductFoundSuccess,
            "Succesfully found the product with id:{Id}");

    public static readonly Action<ILogger, int, Exception?> LogProductModifiedSuccess =
       LoggerMessage.Define<int>(
           LogLevel.Information,
           ProductLogEventIds.ProductModifiedSuccess,
           "Product with id:{Id} succesfully modified");

    public static readonly Action<ILogger, int, Exception?> LogProductDeletedSuccess =
       LoggerMessage.Define<int>(
           LogLevel.Information,
           ProductLogEventIds.ProductDeletedSuccess,
           "Provided product with id:{Id} deleted succesfully");
}
