using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.StockTransaction;

public static class StockTransactionLogEventIds
{
    public static readonly EventId StockTransactionCreated = new(6000, nameof(StockTransactionCreated));
    public static readonly EventId StockTransactionUpdated = new(6001, nameof(StockTransactionUpdated));
    public static readonly EventId StockTransactionDeleted = new(6002, nameof(StockTransactionDeleted));
    public static readonly EventId ReturnedListOfStockTransactions = new(6003, nameof(ReturnedListOfStockTransactions));
    public static readonly EventId StockTransactionFound = new(6004, nameof(StockTransactionFound));

    // Domenowe operacje
    public static readonly EventId StockTransactionReserved = new(6010, nameof(StockTransactionReserved));
    public static readonly EventId StockTransactionReleased = new(6011, nameof(StockTransactionReleased));
    public static readonly EventId StockTransactionConfirmed = new(6012, nameof(StockTransactionConfirmed));
    public static readonly EventId StockTransactionCancelled = new(6013, nameof(StockTransactionCancelled));
    public static readonly EventId StockTransactionAdjusted = new(6014, nameof(StockTransactionAdjusted));

    public static readonly EventId StockTransactionCreateError = new(6100, nameof(StockTransactionCreateError));
    public static readonly EventId StockTransactionUpdateError = new(6101, nameof(StockTransactionUpdateError));
    public static readonly EventId StockTransactionDeleteError = new(6102, nameof(StockTransactionDeleteError));
    public static readonly EventId StockTransactionDomainError = new(6103, nameof(StockTransactionDomainError));

    public static readonly EventId StockTransactionNotFound = new(6200, nameof(StockTransactionNotFound));
    public static readonly EventId StockTransactionValidationFailed = new(6201, nameof(StockTransactionValidationFailed));
    public static readonly EventId StockTransactionValidationFailedHandler = new(6202, nameof(StockTransactionValidationFailedHandler));
    public static readonly EventId StockTransactionAlreadyExists = new(6203, nameof(StockTransactionAlreadyExists));
}
