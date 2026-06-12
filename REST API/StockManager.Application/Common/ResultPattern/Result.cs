namespace StockManager.Application.Common.ResultPattern;

public sealed class Result<T> : IResult
{
    // Represents successfull action
    public Result(T value)
    {
        Value = value;
        Error = null;
    }

    // Represents error action
    public Result(Error error)
    {
        Error = error;
        Value = default;
    }

    public T? Value { get; }
    public Error? Error { get; }
    public bool IsSuccess => Error == null;


    // method depends on success constructor
    public static Result<T> Success(T value) => new Result<T>(value);

    // method depends on failure/error constructor
    public static Result<T> Failure(Error error) => new Result<T>(error);
}