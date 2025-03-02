﻿using StockManager.Core.Domain.Exceptions;

namespace StockManager.Middlewares
{
    public class ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger) : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next.Invoke(context);
            }
            catch (BadRequestException ex)
            {
                logger.LogError(ex, ex.Message);

                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsync("Validation failed for object");
            }
            catch (NotFoundException ex)
            {
                logger.LogError(ex, ex.Message);

                context.Response.StatusCode = StatusCodes.Status404NotFound;
                await context.Response.WriteAsync("Provided object doesnt exist");
            }
            catch (ConflictException ex)
            {
                logger.LogError(ex, ex.Message);

                context.Response.StatusCode = StatusCodes.Status409Conflict;
                await context.Response.WriteAsync("Provided object already exist");
            }
            catch (Exception ex)
            {
                logger.LogError(ex.InnerException?.Message ?? ex.Message);

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsync(string.Join(", ", ex.InnerException?.Message ?? ex.Message)); 
            }
        }
    }
}
