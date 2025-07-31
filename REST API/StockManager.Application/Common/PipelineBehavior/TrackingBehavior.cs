using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.Categories;
using StockManager.Application.Common.Logging.EventIds.General;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.Logging.Supplier;
using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using System.Reflection;
using System.Transactions;

namespace StockManager.Application.Common.PipelineBehavior;

public sealed class TrackingBehavior<TRequest, TResponse> 
    : IPipelineBehavior<TRequest, TResponse> 
    where TRequest : notnull
{
    private readonly ILogger<TrackingBehavior<TRequest, TResponse>> _logger;
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    private readonly IBaseRepository _repository;

    public TrackingBehavior(
        ILogger<TrackingBehavior<TRequest, TResponse>> logger,
        IEnumerable<IValidator<TRequest>> validators,
        IBaseRepository repository
        )
    {
        _logger = logger;
        _validators = validators;
        _repository = repository;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {

        if (_validators.Any())
        {
            try
            {
                var context = new ValidationContext<TRequest>(request);

                ValidationResult[] validationResults = await Task.WhenAll(
                    _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

                var failures = validationResults
                    .Where(r => !r.IsValid)
                    .SelectMany(r => r.Errors)
                    .ToList();

                if (failures.Any())
                {
                    LogValidationFailures(failures);                 
                    throw new ValidationException(failures);
                }
            }
            catch (ValidationException ex)
            {
                GeneralLogWarning.PipelineValidationFailed(_logger, ex);
                throw;
            }
        }

        try
        {
            // checks if request was cancelled
            cancellationToken.ThrowIfCancellationRequested();

            using IDbContextTransaction transaction = await _repository.BeginTransactionAsync(cancellationToken);

            // check if next is null
            ArgumentNullException.ThrowIfNull(next);

            // runs the actual handler logic
            TResponse response = await next().ConfigureAwait(false);

            await transaction.CommitAsync(cancellationToken);

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

    private void LogValidationFailures(IEnumerable<ValidationFailure> failures)
    {
        foreach (ValidationFailure failure in failures)
        {
            GeneralLogWarning.LogBussinessFailure(
                _logger,
                typeof(TRequest).Name,
                $"Validation.{failure.PropertyName}",
                nameof(LoggingCategories.General),
                default
                );
        }
    }

    // result pattern response
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
