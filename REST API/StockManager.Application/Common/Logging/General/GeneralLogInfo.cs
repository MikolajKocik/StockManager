using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.General;

namespace StockManager.Application.Common.Logging.General;

public static class GeneralLogInfo
{
    public static readonly Action<ILogger, string, Exception?> RegistrationSuccess =
         LoggerMessage.Define<string>(
             LogLevel.Information,
             GeneralLogEventIds.RegistrationSuccess,
             "User: {@user} registered succesfully");

    public static readonly Action<ILogger, string, Exception?> AuthorizationSuccess =
        LoggerMessage.Define<string>(
            LogLevel.Information,
            GeneralLogEventIds.AuthorizationSuccess,
            "User: {@user} logged succesfully");

    public static readonly Action<ILogger, string, Exception?> Information =
        LoggerMessage.Define<string>(
            LogLevel.Information,
            GeneralLogEventIds.Information,
            "{@message}");
}
