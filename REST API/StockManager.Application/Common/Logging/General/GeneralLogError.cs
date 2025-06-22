using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.General;

namespace StockManager.Application.Common.Logging.General;

public static class GeneralLogError
{
    public static readonly Action<ILogger, string, Exception?> UnhandledException =
        LoggerMessage.Define<string>(
            LogLevel.Error,
            GeneralLogEventIds.UnhandledException,
            "Unhandled exception in request {RequestType}");

    public static readonly Action<ILogger, string, Exception?> InternalServerError =
        LoggerMessage.Define<string>(
            LogLevel.Error,
            GeneralLogEventIds.InternalServerError,
            "Internal server error occured {Error}");

    public static readonly Action<ILogger, string, Exception?> ArgumentException =
        LoggerMessage.Define<string>(
            LogLevel.Error,
            GeneralLogEventIds.ArgumentException,
            "Argument exception: {Error}");

    public static readonly Action<ILogger, string, Exception?> ArgumentNullException =
        LoggerMessage.Define<string>(
            LogLevel.Error,
            GeneralLogEventIds.ArgumentNullException,
            "Argument exception null: {Error}");
}
