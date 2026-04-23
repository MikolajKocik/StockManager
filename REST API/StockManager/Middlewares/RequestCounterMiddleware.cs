using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Middlewares;

public sealed class RequestCounterMiddleware
{
    private readonly RequestDelegate _next;

    public RequestCounterMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ISystemStatisticsService statisticsService)
    {
        statisticsService.IncrementApiRequests();
        await _next(context);
    }
}
