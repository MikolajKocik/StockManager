using StockManager.Application.Common.Logging.General;
using Microsoft.AspNetCore.Mvc;

namespace StockManager.Middlewares;

public sealed class ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next.Invoke(context);
        }
        catch (ArgumentNullException ex)
        {
            GeneralLogError.ArgumentNullException(logger, ex.Message, ex);
            await WriteProblemAsync(context, StatusCodes.Status404NotFound, "Not found.", ex);
        }
        catch (ArgumentException ex)
        {
            GeneralLogError.ArgumentException(logger, ex.Message, ex);
            await WriteProblemAsync(context, StatusCodes.Status400BadRequest, "Invalid request.", ex);
        }
        catch (InvalidOperationException ex)
        {
            GeneralLogError.InvalidOperationException(logger, ex.Message, ex);
            await WriteProblemAsync(context, StatusCodes.Status400BadRequest, "Invalid operation.", ex);
        }
        catch (Exception ex)
        {
            GeneralLogError.InternalServerError(logger, ex.InnerException?.Message ?? ex.Message, ex);
            await WriteProblemAsync(context, StatusCodes.Status500InternalServerError, "Internal server error occured.", ex);
        }
    }
    
    private static async Task WriteProblemAsync(HttpContext context, int statusCode, string title, Exception ex)
    {
        var problem = new ProblemDetails
        {
            Title = title,
            Status = statusCode,
            Detail = ex.InnerException != null ? $"{ex.Message} - {ex.InnerException.Message}" : ex.Message,
            Extensions = 
            { 
                ["traceId"] = context.TraceIdentifier,
                ["message"] = ex.Message,
                ["innerMessage"] = ex.InnerException?.Message
            }
        };

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";

        await context.Response.WriteAsJsonAsync(problem, context.RequestAborted);
    } 
}
