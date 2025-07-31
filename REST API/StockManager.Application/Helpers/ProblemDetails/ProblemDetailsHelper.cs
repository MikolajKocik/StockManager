namespace StockManager.Application.Helpers.ProblemDetails;

/// <summary>
/// Provides helper methods and properties for working with problem details in error handling.
/// </summary>
/// <remarks>This type is designed to assist in generating standardized problem detail URIs based on error codes.
/// It can be used to create consistent and meaningful links to error documentation or resources.</remarks>
/// <param name="Type"></param>
public record ProblemDetailsHelper(string Type)
{
    public ProblemDetailsHelper(Common.ResultPattern.Error error)
        : this($"https://localhost:7210/errors/{error.Code.ToLowerInvariant().Replace(".", "-")}") { }       
}
