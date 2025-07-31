using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Helpers.ProblemDetails;

namespace StockManager.Application.Extensions.ErrorExtensions;

public static class ErrorExtension
{
    /// <summary>
    /// Converts the specified <see cref="Error"/> instance into an <see cref="IActionResult"/>  representing an HTTP
    /// response with appropriate status code and problem details.
    /// </summary>
    /// <param name="error">The <see cref="Error"/> instance to convert. Cannot be <see langword="null"/>.</param>
    /// <returns>An <see cref="IActionResult"/> containing the problem details and the corresponding HTTP status code  derived
    /// from the <paramref name="error"/>.</returns>
    public static IActionResult ToActionResult(this Error error)
    {
        int statusCode = GetStatusCode(error);
        var problem = error.ToProblemDetails(statusCode);

        return new ObjectResult(problem) { StatusCode = statusCode };
    }

    /// <summary>
    /// Converts the specified <see cref="Error"/> instance into a <see cref="ProblemDetails"/> object.
    /// </summary>
    /// <remarks>The returned <see cref="ProblemDetails"/> includes the error message as the title, the error
    /// code in the detail,  and a type URI derived from the <paramref name="error"/>. If <paramref name="statusCode"/>
    /// is not provided,  a default status code is determined based on the error's characteristics.</remarks>
    /// <param name="error">The <see cref="Error"/> instance to convert. Cannot be <see langword="null"/>.</param>
    /// <param name="statusCode">An optional HTTP status code to associate with the <see cref="ProblemDetails"/>.  If not provided, a default
    /// status code is determined based on the <paramref name="error"/>.</param>
    /// <returns>A <see cref="ProblemDetails"/> object representing the specified <see cref="Error"/>.</returns>
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

    /// <summary>
    /// Maps an <see cref="Error"/> to the corresponding HTTP status code.
    /// </summary>
    /// <param name="error">The <see cref="Error"/> instance representing the error to map.</param>
    /// <returns>An HTTP status code that corresponds to the specified <paramref name="error"/>. For example: <list
    /// type="bullet"> <item><description><see cref="ErrorCodes.UserUnauthorized"/> maps to <see
    /// cref="StatusCodes.Status401Unauthorized"/>.</description></item> <item><description><see
    /// cref="ErrorCodes.ProductNotFound"/> maps to <see cref="StatusCodes.Status404NotFound"/>.</description></item>
    /// <item><description>Other error codes map to their respective status codes, or <see
    /// cref="StatusCodes.Status500InternalServerError"/> for unrecognized errors.</description></item> </list></returns>
    private static int GetStatusCode(Error error)
    {
        return error.Code switch
        {
            // User
            ErrorCodes.UserUnauthorized => StatusCodes.Status401Unauthorized,
            ErrorCodes.UserConflict => StatusCodes.Status409Conflict,
            ErrorCodes.UserValidation => StatusCodes.Status400BadRequest,
            // Product
            ErrorCodes.ProductNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.ProductConflict => StatusCodes.Status409Conflict,
            ErrorCodes.ProductValidation => StatusCodes.Status400BadRequest,
            // Supplier
            ErrorCodes.SupplierNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.SupplierConflict => StatusCodes.Status409Conflict,
            ErrorCodes.SupplierValidation => StatusCodes.Status400BadRequest,
            // Customer
            ErrorCodes.CustomerAlreadyExists => StatusCodes.Status409Conflict,
            ErrorCodes.CustomerConflict => StatusCodes.Status409Conflict,
            ErrorCodes.CustomerCreateFailed => StatusCodes.Status404NotFound,
            ErrorCodes.CustomerDeleteFailed => StatusCodes.Status404NotFound,
            ErrorCodes.CustomerNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.CustomerUpdateFailed => StatusCodes.Status400BadRequest,
            ErrorCodes.CustomerValidation => StatusCodes.Status400BadRequest,
            // InventoryItem
            ErrorCodes.InventoryBinLocationNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.InventoryItemConflict => StatusCodes.Status409Conflict,
            ErrorCodes.InventoryItemNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.InventoryItemValidation => StatusCodes.Status400BadRequest,
            // Shipment
            ErrorCodes.ShipmentNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.ShipmentConflict => StatusCodes.Status409Conflict,
            ErrorCodes.ShipmentValidation => StatusCodes.Status400BadRequest,
            ErrorCodes.ShipmentDeleteFailed => StatusCodes.Status409Conflict,
            ErrorCodes.ShipmentUpdateFailed => StatusCodes.Status400BadRequest,
            ErrorCodes.ShipmentCreateFailed => StatusCodes.Status400BadRequest,
            ErrorCodes.ShipmentAlreadyReturned => StatusCodes.Status400BadRequest,
            ErrorCodes.ShipmentAlreadyCancelled => StatusCodes.Status400BadRequest,
            ErrorCodes.ShipmentAlreadyDelivered => StatusCodes.Status400BadRequest,
            ErrorCodes.ShipmentAlreadyProcessing => StatusCodes.Status400BadRequest,
            // StockTransaction
            ErrorCodes.StockTransactionNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.StockTransactionConflict => StatusCodes.Status409Conflict,
            ErrorCodes.StockTransactionValidation => StatusCodes.Status400BadRequest,
            ErrorCodes.StockTransactionDeleteFailed => StatusCodes.Status409Conflict,
            ErrorCodes.StockTransactionUpdateFailed => StatusCodes.Status400BadRequest,
            ErrorCodes.StockTransactionCreateFailed => StatusCodes.Status400BadRequest,
            // PurchaseOrder
            ErrorCodes.PurchaseOrderNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.PurchaseOrderConflict => StatusCodes.Status409Conflict,
            ErrorCodes.PurchaseOrderValidation => StatusCodes.Status400BadRequest,
            ErrorCodes.PurchaseOrderDeleteFailed => StatusCodes.Status409Conflict,
            ErrorCodes.PurchaseOrderUpdateFailed => StatusCodes.Status400BadRequest,
            ErrorCodes.PurchaseOrderCreateFailed => StatusCodes.Status400BadRequest,
            ErrorCodes.PurchaseOrderAlreadyCancelled => StatusCodes.Status400BadRequest,
            ErrorCodes.PurchaseOrderAlreadyCompleted => StatusCodes.Status400BadRequest,
            ErrorCodes.PurchaseOrderAlreadyProcessing => StatusCodes.Status400BadRequest,
            // SalesOrder
            ErrorCodes.SalesOrderNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.SalesOrderConflict => StatusCodes.Status409Conflict,
            ErrorCodes.SalesOrderValidation => StatusCodes.Status400BadRequest,
            ErrorCodes.SalesOrderDeleteFailed => StatusCodes.Status409Conflict,
            ErrorCodes.SalesOrderUpdateFailed => StatusCodes.Status400BadRequest,
            ErrorCodes.SalesOrderCreateFailed => StatusCodes.Status400BadRequest,
            ErrorCodes.SalesOrderAlreadyCancelled => StatusCodes.Status400BadRequest,
            ErrorCodes.SalesOrderAlreadyCompleted => StatusCodes.Status400BadRequest,
            ErrorCodes.SalesOrderAlreadyProcessing => StatusCodes.Status400BadRequest,
            ErrorCodes.SalesOrderAlreadyDelivered => StatusCodes.Status400BadRequest,
            ErrorCodes.SalesOrderAlreadyReturned => StatusCodes.Status400BadRequest,
            // Invoice
            ErrorCodes.InvoiceNotFound => StatusCodes.Status404NotFound,
            ErrorCodes.InvoiceConflict => StatusCodes.Status409Conflict,
            ErrorCodes.InvoiceValidation => StatusCodes.Status400BadRequest,
            ErrorCodes.InvoiceDeleteFailed => StatusCodes.Status409Conflict,
            ErrorCodes.InvoiceUpdateFailed => StatusCodes.Status400BadRequest,
            ErrorCodes.InvoiceCreateFailed => StatusCodes.Status400BadRequest,
            ErrorCodes.InvoiceAlreadyCancelled => StatusCodes.Status400BadRequest,
            ErrorCodes.InvoiceAlreadyCompleted => StatusCodes.Status400BadRequest,
            ErrorCodes.InvoiceAlreadyProcessing => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };
    } 
}
