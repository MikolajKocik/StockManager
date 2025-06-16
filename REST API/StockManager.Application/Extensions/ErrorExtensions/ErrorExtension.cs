using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.Common;
using StockManager.Application.Helpers.ProblemDetails;

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
            var typeResult = new ProblemDetailsHelper(error);

            return new ProblemDetails
            {
                Title = error.Message,
                Status = statusCode ?? GetStatusCode(error),
                Detail = $"Code: {error.Code}",
                Type = typeResult.Type
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
