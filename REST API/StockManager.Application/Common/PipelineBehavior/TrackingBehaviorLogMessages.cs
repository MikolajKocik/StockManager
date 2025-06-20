using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Models;

namespace StockManager.Application.Common.PipelineBehavior;

public static class TrackingBehaviorLogMessages
{
    // Error messages ==================================================================================================

    public static readonly Action<ILogger, string, Exception?> LogUnhandledException =
        LoggerMessage.Define<string>(
            LogLevel.Error,
            new EventId(1, "UnhandledException"),
            "Unhandled exception in request {RequestType}");

    public static readonly Action<ILogger, Exception?> LogRemovingSupplierException =
        LoggerMessage.Define(
            LogLevel.Error,
            new EventId(2, "RemovingSupplierException"),
            "Error occured while removing supplier");

    public static readonly Action<ILogger, Exception?> LogAddingDataException =
        LoggerMessage.Define(
            LogLevel.Error,
            new EventId(3, "UnhandledException"),
            "Error ocurred while adding a new product");

    public static readonly Action<ILogger, Exception?> LogAddingSupplierException =
        LoggerMessage.Define(
            LogLevel.Error,
            new EventId(4, "AddingSupplierException"),
            "Error ocurred while adding a new supplier");

    public static readonly Action<ILogger, Exception?> LogEditingProductException =
        LoggerMessage.Define(
            LogLevel.Error,
            new EventId(5, "EditingProductException"),
            "Error occured while editing data");

    public static readonly Action<ILogger, Exception?> LogRemovingProductException =
      LoggerMessage.Define(
          LogLevel.Error,
          new EventId(2, "RemovingProductException"),
          "Error occured while removing product");

    // Warning messages ==================================================================================================

    public static readonly Action<ILogger, string, string?, string?, Exception?> LogBussinessFailure =
        LoggerMessage.Define<string, string?, string?>(
            LogLevel.Warning,
            new EventId(40, "BusinessFailure"),
            "Bussiness failure in {RequestType}: {ErrorCode} - {ErrorMessage}");

    public static readonly Action<ILogger, int, Exception?> LogProductNotFound =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            new EventId(41, "ProductNotFound"),
            "Product with id:{ProductId} not found. Rolling back transaction");

    public static readonly Action<ILogger, ProductDto, Exception?> LogProductValidationFailed =
        LoggerMessage.Define<ProductDto>(
            LogLevel.Warning,
            new EventId(42, "ProductValidationFailed"),
            "Validation failed for {Product}. Rolling back transaction");

    public static readonly Action<ILogger, Product, string, Exception?> LogProductValidationFailedExtended =
        LoggerMessage.Define<Product, string>(
            LogLevel.Warning,
            new EventId(43, "ProductValidationFailedExtended"),
            "Validation failed for product:{@product}. Errors: {Errors}. Rolling back transaction");

    public static readonly Action<ILogger, List<ValidationFailure>, Exception?> LogSupplierValidationFailed =
        LoggerMessage.Define<List<ValidationFailure>>(
            LogLevel.Warning,
            new EventId(44, "SupplierValidationFailed "),
            "Validation failed for supplier: {ValidationErrors}");

    public static readonly Action<ILogger, Guid, Exception?> LogSupplierNotFound =
        LoggerMessage.Define<Guid>(
             LogLevel.Warning,
             new EventId(45, "SupplierNotFound"),
             "Supplier with id:{@supplierId} not found. Rolling back transaction");

    // Information messages =============================================================================================

    public static readonly Action<ILogger, string, Exception?> LogRequestCancelled =
        LoggerMessage.Define<string>(
             LogLevel.Information,
             new EventId(60, "RequestCancelled"),
             "Request for {RequestType} was cancelled");

    public static readonly Action<ILogger, ProductDto, Exception?> LogAddProductOperationSuccesfull =
        LoggerMessage.Define<ProductDto>(
             LogLevel.Information,
             new EventId(61, "AddProductOperationSuccesfull"),
             "Adding a new product {Product} to database");

    public static readonly Action<ILogger, Supplier, Exception?> LogSupplierOperationSuccesfull =
        LoggerMessage.Define<Supplier>(
             LogLevel.Information,
             new EventId(62, "AddSupplierOperationSuccesfull"),
             "Adding a new supplier {Supplier} to database");

    public static readonly Action<ILogger, int, Exception?> LogRemovingProductOperation =
        LoggerMessage.Define<int>(
             LogLevel.Warning,
             new EventId(63, "RemovingProductOperation"),
             "Removing the provided product:{@product}");

    public static readonly Action<ILogger, Guid, Exception?> LogRemovingSupplierOperation =
        LoggerMessage.Define<Guid>(
             LogLevel.Warning,
             new EventId(64, "RemovingSupplierOperation"),
             "Removing the provided supplier:{@supplier}");

    public static readonly Action<ILogger, Guid, Exception?> LogSupplierAlreadyExists =
        LoggerMessage.Define<Guid>(
             LogLevel.Warning,
             new EventId(65, "SupplierAlreadyExists"),
             "Supplier {SupplierId} already exists. Assigning the product to the existing supplier.");

    public static readonly Action<ILogger, Guid?, Exception?> LogSupplierNotExists =
        LoggerMessage.Define<Guid?>(
             LogLevel.Warning,
             new EventId(66, "SupplierNotExists"),
             "Supplier with ID {SupplierId} does not exist. Creating a new supplier.");

    public static readonly Action<ILogger, int, ProductDto, Exception?> LogModyfingProduct =
        LoggerMessage.Define<int, ProductDto>(
             LogLevel.Warning,
             new EventId(67, "ModyfingProduct"),
             "Modifying the provided product:{@productId} with {@modifiedProduct}");

    public static readonly Action<ILogger, Supplier, Exception?> LogAddSupplierOperationSuccesfull =
        LoggerMessage.Define<Supplier>(
             LogLevel.Information,
             new EventId(68, "AddSupplierOperationSuccesfull"),
             "Adding a new supplier {NewSupplier}");

    public static readonly Action<ILogger, Result<IEnumerable<SupplierDto>>, Exception?> LogSuccesfullReturnedListOfSuppliers =
        LoggerMessage.Define<Result<IEnumerable<SupplierDto>>>(
             LogLevel.Information,
             new EventId(69, "SuccesfullReturnedListOfSuppliers"),
             "Successfully returned a list of suppliers: {Suppliers}");

    public static readonly Action<ILogger, Result<SupplierDto>, Exception?> LogSupplierFoundSuccessfull =
        LoggerMessage.Define<Result<SupplierDto>>(
             LogLevel.Information,
             new EventId(70, "SupplierFoundSuccessfull"),
             "Supplier {@supplier} found successfull");

}
