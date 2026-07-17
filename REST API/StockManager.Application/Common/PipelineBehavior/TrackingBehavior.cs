using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Categories;
using StockManager.Application.Common.Logging.General;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Application.Common.ResultPattern;

namespace StockManager.Application.Common.PipelineBehavior;

public sealed class TrackingBehavior<TRequest, TResponse>(
        ILogger<TrackingBehavior<TRequest, TResponse>> logger,
        IEnumerable<IValidator<TRequest>> validators,
        IUnitOfWork uow
    )
    : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest
{
    private readonly ILogger<TrackingBehavior<TRequest, TResponse>> _logger = logger;
    private readonly IEnumerable<IValidator<TRequest>> _validators = validators;
    private readonly IUnitOfWork _uow = uow;

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        ct.ThrowIfCancellationRequested();

        if (_validators.Any())
        {
            try
            {
                var context = new ValidationContext<TRequest>(request);

                ValidationResult[] validationResults = await Task.WhenAll(
                    _validators.Select(v => v.ValidateAsync(context, ct)));

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

        if (request is IBaseCommand)
        {
            ITransaction transaction = await _uow.BeginTransactionAsync(ct);

            try
            {
                TResponse response = await next().ConfigureAwait(false);

                ArgumentNullException.ThrowIfNull(next);

                if (response is IResult { IsSuccess: true })
                {
                    await transaction.CommitAsync(ct);
                }
                else
                {
                    await transaction.RollbackAsync(ct);
                }

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

        return await next();
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

    private void TryLogBusinessFailure(TResponse response)
    {
        if (response is IResult { IsSuccess: false } result && result.Error != null)
        {
            GeneralLogWarning.LogBussinessFailure(
                _logger,
                typeof(TRequest).Name,
                result.Error.Code,
                result.Error.Message,
                default
            );
        }
    }
}
