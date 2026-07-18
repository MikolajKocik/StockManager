using System.Reflection;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.ResultPattern;

namespace StockManager.Application.Middlewares;

public class SqlExceptionPipelineBehavior<TRequest, TResponse>(
        ILogger<SqlExceptionPipelineBehavior<TRequest, TResponse>> logger
    ) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest
{
    private readonly ILogger<SqlExceptionPipelineBehavior<TRequest, TResponse>> _logger = logger;

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        try
        {
            return await next();
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx)
        {
            _logger.LogError(ex, "SQL Exception occurred during request execution. Error Number: {SqlCode}", sqlEx.Number);

            Error error = sqlEx.Number switch
            {
                2601 or 2627 => new Error("Duplicate entry. A record with the same unique key already exists.", "Database.DuplicateEntry"),
                547 => new Error("Foreign key constraint violation. The operation is invalid due to related records.", "Database.ForeignKeyViolation"),
                _ => new Error(sqlEx.Message, "Database.SqlError")
            };

            if (typeof(TResponse).IsGenericType && typeof(TResponse).GetGenericTypeDefinition() == typeof(Result<>))
            {
                Type valueType = typeof(TResponse).GetGenericArguments()[0];
                MethodInfo? failureMethod = typeof(Result<>).MakeGenericType(valueType)
                    .GetMethod("Failure", BindingFlags.Public | BindingFlags.Static);

                if (failureMethod is not null)
                {
                    object? failureResult = failureMethod.Invoke(null, [error]);
                    return (TResponse)failureResult!;
                }
            }

            throw;
        }
    }
}
