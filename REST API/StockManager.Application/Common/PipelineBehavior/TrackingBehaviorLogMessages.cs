using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.PipelineBehavior
{
    public static class TrackingBehaviorLogMessages
    {
        public static readonly Action<ILogger, string, Exception?> LogUnhandledException =
            LoggerMessage.Define<string>(
                LogLevel.Error,
                new EventId(1, "UnhandledException"),
                "Unhandled exception in request {RequestType}");

        public static readonly Action<ILogger, string, Exception?> LogRequestCancelled =
            LoggerMessage.Define<string>(
                LogLevel.Information,
                new EventId(2, "RequestCancelled"),
                "Request for {RequestType} was cancelled");

        public static readonly Action<ILogger, string, string?, string?, Exception?> LogBussinessFailure =
            LoggerMessage.Define<string, string?, string?>(
                LogLevel.Warning,
                new EventId(3, "BusinessFailure"),
                "Bussiness failure in {RequestType}: {ErrorCode} - {ErrorMessage}");
    }
}
