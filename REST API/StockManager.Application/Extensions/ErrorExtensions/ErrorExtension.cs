using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.Common;
using System;
namespace StockManager.Application.Extensions.ErrorExtensions
{
    public static class ErrorExtension
    {
        public static IActionResult ToActionResult(this Error error)
        {
            var statusCode = GetStatusCode(error);
            var problem = error.ToProblemDetails(statusCode);

            return new ObjectResult(problem) { StatusCode = statusCode };
        }

        public static ProblemDetails ToProblemDetails(this Error error, int? statusCode = null)
        {
            return new ProblemDetails
            {
                Title = error.Message,
                Status = statusCode ?? GetStatusCode(error),
                Detail = $"Code : {error.Code}",
                Type = $"https://localhost:7210/errors/{error.Code.ToLowerInvariant().Replace(".", "-")}"
            };
        }

        private static int GetStatusCode(Error error)
        {
            return error.Code.ToLowerInvariant() switch
            {
                var c when c.Contains("NotFound") => StatusCodes.Status404NotFound,
                var c when c.Contains("Conflict") => StatusCodes.Status409Conflict,
                var c when c.Contains("Validation") => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError
            };
        }
    }
}
