using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Helpers.ProblemDetails;

namespace StockManager.Application.Extensions.ErrorExtensions;

public static class ErrorExtension
{
    public static IActionResult ToActionResult(this Error error)
    {
        int statusCode = GetStatusCode(error);
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
        return error.Code switch
        {

            ErrorCodes.UserUnauthorized => StatusCodes.Status401Unauthorized,
            ErrorCodes.UserConflict => StatusCodes.Status409Conflict,
            ErrorCodes.UserValidation => StatusCodes.Status400BadRequest,
            //
            ErrorCodes.ProductNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.ProductConflict => StatusCodes.Status409Conflict,
            ErrorCodes.ProductValidation => StatusCodes.Status400BadRequest,
            //
            ErrorCodes.SupplierNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.SupplierConflict => StatusCodes.Status409Conflict,
            ErrorCodes.SupplierValidation => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };
    } 
}
