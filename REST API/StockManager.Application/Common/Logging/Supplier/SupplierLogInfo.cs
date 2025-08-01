﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Supplier;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.Common.Logging.Supplier;

public static class SupplierLogInfo
{
    public static readonly Action<ILogger, Core.Domain.Models.SupplierEntity.Supplier, Exception?> LogSupplierAddedSuccesfull =
        LoggerMessage.Define<Core.Domain.Models.SupplierEntity.Supplier>(
            LogLevel.Information,
            SupplierLogEventIds.SupplierAddedSuccesfull,
            "Adding a new supplier {@supplier} to database");

    public static readonly Action<ILogger, Result<IEnumerable<SupplierDto>>, Exception?> LogSuccesfullReturnedListOfSuppliers =
        LoggerMessage.Define<Result<IEnumerable<SupplierDto>>>(
            LogLevel.Information,
            SupplierLogEventIds.SuccesfullReturnedListOfSuppliers,
            "Successfully returned a list of suppliers: {@suppliers}");

    public static readonly Action<ILogger, Result<SupplierDto>, Exception?> LogSupplierFoundSuccessfull =
        LoggerMessage.Define<Result<SupplierDto>>(
            LogLevel.Information,
            SupplierLogEventIds.SupplierFoundSuccessfull,
            "Supplier: {@supplier} found successfull");

    public static readonly Action<ILogger, Guid, Exception?> LogSupplierModifiedSuccessfull =
        LoggerMessage.Define<Guid>(
            LogLevel.Information,
            SupplierLogEventIds.SupplierModifiedSuccessfull,
            "Supplier with ID: {Id} deleted successfully");

    public static readonly Action<ILogger, Guid, Exception?> LogSupplierRemovedSuccessfull =
        LoggerMessage.Define<Guid>(
            LogLevel.Information,
            SupplierLogEventIds.SupplierRemovedSuccessfull,
            "Supplier with ID: {Id} deleted successfully");

    public static readonly Action<ILogger, SupplierCreateDto, Exception?> LogReturningNewSupplier =
        LoggerMessage.Define<SupplierCreateDto>(
            LogLevel.Information,
            SupplierLogEventIds.ReturningNewSupplier,
            "Returning a new supplier: {@supplier}");

    public static readonly Action<ILogger, Guid, Exception?> LogRemovingSupplier =
       LoggerMessage.Define<Guid>(
           LogLevel.Information,
           SupplierLogEventIds.RemovingSupplier,
           "Removing supplier: {SupplierId}");

    public static readonly Action<ILogger, Guid, SupplierUpdateDto, Exception?> LogModyfingSupplier =
      LoggerMessage.Define<Guid, SupplierUpdateDto>(
          LogLevel.Information,
          SupplierLogEventIds.ModyfingSupplier,
          "Modyfing the provided supplier: {@supplierId} with modified {@modifiedSupplier}");
}
