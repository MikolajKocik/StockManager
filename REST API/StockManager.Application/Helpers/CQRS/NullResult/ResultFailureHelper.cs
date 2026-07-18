using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.Error;
using EmptyError = StockManager.Application.Common.ResultPattern.Error;

namespace StockManager.Application.Helpers.CQRS.NullResult;
internal sealed class ResultFailureHelper
{
    /// <summary>
    /// Returns a failure result if the provided reference-type argument is <see langword="null"/>.
    /// </summary>
    /// <typeparam name="T">The reference type of the argument being validated.</typeparam>
    /// <param name="arg">The argument to validate.</param>
    /// <returns>A failure result containing an error message and error code if <paramref name="arg"/> is <see langword="null"/>.</returns>
    public static Result<T> IfProvidedNullArgument<T>(T? arg) where T : class
    {
        if (arg is null)
        {
            return Result<T>.Failure(new EmptyError(
                "Provided argument is null",
                ErrorCodes.GeneralBadRequest));
        }

        return Result<T>.Success(arg);
    }


    public static Result<T> AgainstDefaultValue<T>(T value) where T : struct, IEquatable<T>
    {
        
        if (Equals(value, default(T)))
        {
            return Result<T>.Failure(new EmptyError(
                "Provided argument is default",
                ErrorCodes.GeneralBadRequest));
        }
        
        return Result<T>.Success(value);
    }
}
