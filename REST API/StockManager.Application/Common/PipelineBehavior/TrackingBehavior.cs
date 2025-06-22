using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.General;
using StockManager.Application.Common.Logging.General;
using System.Reflection;

namespace StockManager.Application.Common.PipelineBehavior;

public sealed class TrackingBehavior<TRequest, TResponse> 
    : IPipelineBehavior<TRequest, TResponse> 
    where TRequest : notnull
{
    private readonly ILogger<TrackingBehavior<TRequest, TResponse>> _logger;

    public TrackingBehavior(ILogger<TrackingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        try
        {
            // checks if request was cancelled
            cancellationToken.ThrowIfCancellationRequested();

            // check if next is null
            ArgumentNullException.ThrowIfNull(next);

            // runs the actual handler logic
            TResponse response = await next().ConfigureAwait(false);             

            // tries to log business-level failure, if one occurred
            TryLogBusinessFailure(response);

            return response;
        }
        catch (OperationCanceledException ex)
        {
            GeneralLogWarning.RequestCancelled(_logger, typeof(TRequest).Name, ex);
            throw;
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, typeof(TRequest).Name, ex);
            throw;
        }
    }

    // reflection for result pattern response
    private void TryLogBusinessFailure(object? response)
    {
        if (response is null)
        {
            return;
        }

        Type responseType = response.GetType();
        PropertyInfo? isSuccessProp = responseType.GetProperty("IsSuccess");
        PropertyInfo? errorProp = responseType.GetProperty("Error");

        if (isSuccessProp is not null && errorProp is not null)
        {       
            object rawValue = isSuccessProp.GetValue(response);
            
            // sillently skip if null or not bool 
            if (rawValue is not bool IsSuccess)
            {
                return;
            }

            // if Result<>.Failure(), try to log the error info
            if (!IsSuccess)
            {
                object error = errorProp.GetValue(response);

                string? errorMessage = error?.GetType().GetProperty("Message")?.GetValue(error)?.ToString();
                string? errorCode = error?.GetType().GetProperty("Error")?.GetValue(error)?.ToString();

                GeneralLogWarning.LogBussinessFailure(_logger, typeof(TRequest).Name, errorCode, errorMessage, default);
            }
        }
    }
}
