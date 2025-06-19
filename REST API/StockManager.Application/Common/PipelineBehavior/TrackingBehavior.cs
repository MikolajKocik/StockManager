using MediatR;
using Microsoft.Extensions.Logging;
using System.Reflection;

namespace StockManager.Application.Common.PipelineBehavior
{
    public sealed class TrackingBehavior<TRequest, TResponse> 
        : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
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

                // runs the actual handler logic
                var response = await next();

                // tries to log business-level failure, if one occurred
                TryLogBusinessFailure(response);

                return response;
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Request for {RequestType} was cancelled", typeof(TRequest).Name);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception in request {RequestType}", typeof(TRequest).Name);
                throw;
            }
        }

        // reflection 
        private void TryLogBusinessFailure(object? response)
        {
            if (response is null)
                return;

            Type responseType = response.GetType();
            PropertyInfo? isSuccessProp = responseType.GetProperty("IsSuccess");
            PropertyInfo? errorProp = responseType.GetProperty("Error");

            if (isSuccessProp is not null && errorProp is not null)
            {       
                var rawValue = isSuccessProp.GetValue(response);
                
                // sillently skip if null or not bool 
                if (rawValue is not bool isSuccess)
                    return;

                // if Result<>.Failure(), try to log the error info
                if (!isSuccess)
                {
                    var error = errorProp.GetValue(response);

                    string? errorMessage = error?.GetType().GetProperty("Message")?.GetValue(error)?.ToString();
                    string? errorCode = error?.GetType().GetProperty("Error")?.GetValue(error)?.ToString();

                    _logger.LogWarning("Business failure in {RequestType}: {ErrorCode} - {ErrorMessage}",
                        typeof(TRequest).Name, errorCode, errorMessage);
                }
            }
        }
    }
}
