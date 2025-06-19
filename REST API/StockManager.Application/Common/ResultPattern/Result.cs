namespace StockManager.Application.Common.ResultPattern
{
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

        /// <summary>
        /// Transforms the current Result into another type based on whether it is a success or failure.
        /// </summary>
        /// <typeparam name="TResult">The type to map to.</typeparam>
        /// <param name="onSuccess">Function to apply if the result is successful.</param>
        /// <param name="onFailure">Function to apply if the result is a failure.</param>
        /// <returns>The result of either the success or failure function.</returns>

        public TResult Map<TResult>(Func<T, TResult> onSuccess, Func<Error, TResult> onFailure)
        {
            return IsSuccess ? onSuccess(Value!) : onFailure(Error!);
        }
    }
}
