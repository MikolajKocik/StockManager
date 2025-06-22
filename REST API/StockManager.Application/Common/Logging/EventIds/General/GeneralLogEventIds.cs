using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.General;

public static class GeneralLogEventIds
{
    // Error
    public static readonly EventId UnhandledException = new(1, "UnhandledException");
    public static readonly EventId InternalServerError = new(2, "InternalServerError");
    public static readonly EventId ArgumentException = new(3, "ArgumentException");
    public static readonly EventId ArgumentNullException = new(4, "ArgumentNullException");

    // Warning
    public static readonly EventId RequestCancelled = new(10, "RequestCancelled");
    public static readonly EventId PipelineValidationFailed = new(11, "PipelineValidationFailed");
    public static readonly EventId AuthorizationFailed = new(12, "AuthorizationFailed");
    public static readonly EventId BusinessFailure = new(13, "BusinessFailure");
    public static readonly EventId RegistrationFailed = new(13, "RegistrationFailed");
    public static readonly EventId UserAlreadyExists = new(14, "UserAlreadyExists");
    public static readonly EventId RegistrationFailedService = new(15, "RegistrationFailedService");

    // Information
    public static readonly EventId RegistrationSuccess = new(20, "RegistrationSuccess");
    public static readonly EventId AuthorizationSuccess = new(21, "AuthorizationSuccess");

}
