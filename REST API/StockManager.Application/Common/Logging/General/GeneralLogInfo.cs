using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
}
