using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.Error;

namespace StockManager.Application.Helpers.CQRS.NullResult;
internal sealed class ResultFailureHelper
{
    /// <summary>
    /// Returns a failure result if the provided argument is <see langword="null"/>.
    /// </summary>
    /// <typeparam name="T">The type of the argument being validated.</typeparam>
    /// <param name="arg">The argument to validate. Must not be <see langword="null"/>.</param>
    /// <returns>A failure result containing an error message and error code if <paramref name="arg"/> is <see langword="null"/>.</returns>
    public static Result<T> IfProvidedNullArgument<T>(T arg)
    {

        return Result<T>.Failure(new Common.ResultPattern.Error(
            "Provided argument is null",
            ErrorCodes.GeneralBadRequest));
    }
}
