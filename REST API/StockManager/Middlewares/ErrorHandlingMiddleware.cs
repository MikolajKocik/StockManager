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
            logger.LogError(ex.Message);

            context.Response.StatusCode = StatusCodes.Status404NotFound;
            await context.Response.WriteAsync(string.Join(", ", ex.Message));
        }
        catch (ArgumentException ex)
        {
            logger.LogError(ex.Message);

            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsync(string.Join(", ", ex.Message));
        }
        catch (Exception ex)
        {
            logger.LogError(ex.InnerException?.Message ?? ex.Message);

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsync(string.Join(", ", ex.InnerException?.Message ?? ex.Message)); 
        }
    }
}
