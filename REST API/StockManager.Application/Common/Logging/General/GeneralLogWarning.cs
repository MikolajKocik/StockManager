using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.General;
using StockManager.Core.Domain.Models;

namespace StockManager.Application.Common.Logging.General;

public static class GeneralLogWarning
{
    public static readonly Action<ILogger, string, Exception?> RequestCancelled =
        LoggerMessage.Define<string>(
            LogLevel.Error,
            GeneralLogEventIds.RequestCancelled,
            "Request cancelled {RequestType}");

    public static readonly Action<ILogger, Exception?> PipelineValidationFailed =
        LoggerMessage.Define(
            LogLevel.Warning,
            GeneralLogEventIds.PipelineValidationFailed,
            "Validation failed");

    public static readonly Action<ILogger, Exception?> AuthorizationFailed =
        LoggerMessage.Define(
            LogLevel.Warning,
            GeneralLogEventIds.AuthorizationFailed,
            "Authorization Failed");

    public static readonly Action<ILogger, string, string?, string?, Exception?> LogBussinessFailure =
        LoggerMessage.Define<string, string?, string?>(
            LogLevel.Warning,
            GeneralLogEventIds.BusinessFailure,
            "Bussiness failure in {RequestType}: {ErrorCode} - {ErrorMessage}");

    public static readonly Action<ILogger, Exception?> RegistrationFailed =
        LoggerMessage.Define(
            LogLevel.Warning,
            GeneralLogEventIds.RegistrationFailed,
            "Registration Failed");

    public static readonly Action<ILogger, string, Exception?> UserAlreadyExists =
        LoggerMessage.Define<string>(
            LogLevel.Warning,
            GeneralLogEventIds.UserAlreadyExists,
            "User: {@user} already exists");

    public static readonly Action<ILogger, string, Exception?> RegistrationFailedService =
       LoggerMessage.Define<string>(
           LogLevel.Warning,
           GeneralLogEventIds.RegistrationFailedService,
           "User: {@user} registration failed");
}
