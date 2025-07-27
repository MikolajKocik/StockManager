using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.Common.Logging.EventIds.Product;

public static class ProductLogEventIds
{
    // Error
    public static readonly EventId EditingProductException = new(60, "EditingProductException");
    public static readonly EventId RemovingProductException = new(61, "RemovingProductException");

    // Warning
    public static readonly EventId ProductNotFound = new(70, "ProductNotFound");
    public static readonly EventId ProductValidationFailed = new(71, "ProductValidationFailed");
    public static readonly EventId ProductValidationFailedExtended = new(72, "ProductValidationFailedExtended");

    // Information
    public static readonly EventId AddProductSuccesfull = new(80, "AddProductSuccesfull");
    public static readonly EventId RemovingProductOperation = new(81, "RemovingProductOperation");
    public static readonly EventId ModyfingProduct = new(82, "ModyfingProduct");
    public static readonly EventId ReturningListOfProductSuccessfull = new(83, "ReturningListOfProductSuccessfull");
    public static readonly EventId ProductFoundSuccess = new(84, "ProductFoundSuccess");
    public static readonly EventId ProductModifiedSuccess = new(85, "ProductsModifiedSuccess");
    public static readonly EventId ProductDeletedSuccess = new(86, "ProductDeletedSuccess");

}
