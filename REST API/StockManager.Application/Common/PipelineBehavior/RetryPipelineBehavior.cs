using MediatR;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Retry;

namespace StockManager.Application.Common.PipelineBehavior;

public sealed class RetryPipelineBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ResiliencePipeline _pipeline;
    private readonly ILogger<RetryPipelineBehavior<TRequest, TResponse>> _logger;

    public RetryPipelineBehavior(ILogger<RetryPipelineBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
        
        _pipeline = new ResiliencePipelineBuilder()
            .AddRetry(new RetryStrategyOptions
            {
                MaxRetryAttempts = 3,
                Delay = TimeSpan.FromSeconds(2),
                BackoffType = DelayBackoffType.Exponential,
                ShouldHandle = new PredicateBuilder().Handle<Exception>(ex => 
                    // Handle transient DB exceptions or specific custom exceptions
                    ex.Message.Contains("timeout", StringComparison.OrdinalIgnoreCase) || 
                    ex.Message.Contains("deadlock", StringComparison.OrdinalIgnoreCase) || 
                    ex.Message.Contains("transient", StringComparison.OrdinalIgnoreCase)),
                OnRetry = args =>
                {
                    _logger.LogWarning("Retrying {RequestName}. Attempt {AttemptNumber} due to {ExceptionMessage}",
                        typeof(TRequest).Name, args.AttemptNumber + 1, args.Outcome.Exception?.Message);
                    return default;
                }
            })
            .Build();
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        return await _pipeline.ExecuteAsync(async ct => await next(), cancellationToken);
    }
}
