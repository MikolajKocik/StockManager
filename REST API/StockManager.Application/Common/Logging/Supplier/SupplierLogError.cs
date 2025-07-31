using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Supplier;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.Common.Logging.Supplier;

public static class SupplierLogError
{
    public static readonly Action<ILogger, Guid, string?, Exception?> LogRemovingSupplierException =
       LoggerMessage.Define<Guid, string?>(
           LogLevel.Error,
           SupplierLogEventIds.RemovingSupplierException,
           "Error occurred while deleting supplier with ID {Id}: {Error}");

    public static readonly Action<ILogger, string, Exception?> LogAddingSupplierException =
        LoggerMessage.Define<string>(
           LogLevel.Error,
           SupplierLogEventIds.AddingSupplierException,
           "Error occurred while adding supplier: {Error}");

    public static readonly Action<ILogger, Guid, string, Exception?> LogRetrievingSupplierById =
       LoggerMessage.Define<Guid, string>(
           LogLevel.Error,
           SupplierLogEventIds.RetrievingSupplierById,
           "Error occurred while retrieving supplier by ID {Id}: {Error}");

    public static readonly Action<ILogger, Guid, string, Exception?> LogModifiedSupplierException =
       LoggerMessage.Define<Guid, string>(
           LogLevel.Error,
           SupplierLogEventIds.ModifiedSupplierException,
           "Error occurred while updating supplier with ID {Id}: {Error}");
}
