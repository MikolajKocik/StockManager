using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Supplier;

namespace StockManager.Middlewares;

public sealed class ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next.Invoke(context);
        }
        catch(ArgumentNullException ex)
        {
            GeneralLogError.ArgumentNullException(logger, ex.Message, ex);

            context.Response.StatusCode = StatusCodes.Status404NotFound;
            await context.Response.WriteAsync(string.Join(", ", ex.Message));
        }
        catch (ArgumentException ex)
        {
            GeneralLogError.ArgumentException(logger, ex.Message, ex);

            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsync(string.Join(", ", ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            GeneralLogError.InvalidOperationException(logger, ex.Message, ex);

            context.Response.StatusCode = StatusCodes.Status400BadRequest;  
            await context.Response.WriteAsync(string.Join(", ", ex.Message));
        }
        catch (Exception ex)
        {
            GeneralLogError.InternalServerError(logger, ex.InnerException?.Message ?? ex.Message, ex);

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsync(string.Join(", ", ex.InnerException?.Message ?? ex.Message)); 
        }
    }
}
