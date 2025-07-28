namespace StockManager.Application.Helpers.ProblemDetails;

public record ProblemDetailsHelper(string Type)
{
    public ProblemDetailsHelper(Common.ResultPattern.Error error)
        : this($"https://localhost:7210/errors/{error.Code.ToLowerInvariant().Replace(".", "-")}") { }       
}
