namespace StockManager.Application.Helpers.ProblemDetails
{
    internal record ProblemDetailsHelper(string Type)
    {
        public ProblemDetailsHelper(StockManager.Application.Common.Error error)
            : this($"https://localhost:7210/errors/{error.Code.ToLowerInvariant().Replace(".", "-")}") { }       
    }
}
