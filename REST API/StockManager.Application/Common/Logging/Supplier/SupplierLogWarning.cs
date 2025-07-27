using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Supplier;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.Common.Logging.Supplier;

public static class SupplierLogWarning
{
    public static readonly Action<ILogger, List<ValidationFailure>, Exception?> LogSupplierValidationFailed =
        LoggerMessage.Define<List<ValidationFailure>>(
            LogLevel.Warning,
            SupplierLogEventIds.SupplierValidationFailed,
            "Validation failed for supplier: {ValidationErrors}");

    public static readonly Action<ILogger, string, Exception?> LogSupplierValidationFailedHandler =
      LoggerMessage.Define<string>(
          LogLevel.Warning,
          SupplierLogEventIds.SupplierValidationFailedHandler,
          "Validation failed for supplier: {ValidationErrors}");

    public static readonly Action<ILogger, Guid, Exception?> LogSupplierNotFound =
        LoggerMessage.Define<Guid>(
             LogLevel.Warning,
             SupplierLogEventIds.SupplierNotFound,
             "Supplier with id:{@supplierId} not found. Rolling back transaction");

    public static readonly Action<ILogger, Guid, Exception?> LogRemovingSupplierOperation =
       LoggerMessage.Define<Guid>(
            LogLevel.Warning,
            SupplierLogEventIds.SupplierAddedSuccesfull,
            "Removing the provided supplier:{@supplier}");

    public static readonly Action<ILogger, Guid?, Exception?> LogSupplierAlreadyExists =
        LoggerMessage.Define<Guid?>(
             LogLevel.Warning,
             SupplierLogEventIds.SupplierAlreadyExists,
             "Supplier {SupplierId} already exists. Assigning the product to the existing supplier.");

    public static readonly Action<ILogger, Guid?, Exception?> LogSupplierNotExists =
        LoggerMessage.Define<Guid?>(
             LogLevel.Warning,
             SupplierLogEventIds.SupplierNotExists,
             "Supplier with ID {SupplierId} does not exist. Creating a new supplier.");
}
