using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.SalesOrder;

public static class SalesOrderLogEventIds
{
    public static readonly EventId SalesOrderCreated = new(4000, nameof(SalesOrderCreated));
    public static readonly EventId SalesOrderUpdated = new(4001, nameof(SalesOrderUpdated));
    public static readonly EventId SalesOrderDeleted = new(4002, nameof(SalesOrderDeleted));
    public static readonly EventId SalesOrderCancelled = new(4003, nameof(SalesOrderCancelled));
    public static readonly EventId SalesOrderCompleted = new(4004, nameof(SalesOrderCompleted));
    public static readonly EventId ReturnedListOfSalesOrders = new(4005, nameof(ReturnedListOfSalesOrders));
    public static readonly EventId SalesOrderFound = new(4006, nameof(SalesOrderFound));

    public static readonly EventId SalesOrderCreateError = new(4100, nameof(SalesOrderCreateError));
    public static readonly EventId SalesOrderUpdateError = new(4101, nameof(SalesOrderUpdateError));
    public static readonly EventId SalesOrderDeleteError = new(4102, nameof(SalesOrderDeleteError));
    public static readonly EventId SalesOrderCancelError = new(4103, nameof(SalesOrderCancelError));
    public static readonly EventId SalesOrderCompleteError = new(4104, nameof(SalesOrderCompleteError));

    public static readonly EventId SalesOrderNotFound = new(4200, nameof(SalesOrderNotFound));
    public static readonly EventId SalesOrderValidationFailed = new(4201, nameof(SalesOrderValidationFailed));
    public static readonly EventId SalesOrderValidationFailedHandler = new(4202, nameof(SalesOrderValidationFailedHandler));
}
