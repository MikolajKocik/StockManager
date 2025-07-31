using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.PurchaseOrder;

public static class PurchaseOrderLogEventIds
{
    public static readonly EventId PurchaseOrderCreated = new(5000, nameof(PurchaseOrderCreated));
    public static readonly EventId PurchaseOrderUpdated = new(5001, nameof(PurchaseOrderUpdated));
    public static readonly EventId PurchaseOrderDeleted = new(5002, nameof(PurchaseOrderDeleted));
    public static readonly EventId PurchaseOrderCancelled = new(5003, nameof(PurchaseOrderCancelled));
    public static readonly EventId PurchaseOrderCompleted = new(5004, nameof(PurchaseOrderCompleted));
    public static readonly EventId ReturnedListOfPurchaseOrders = new(5005, nameof(ReturnedListOfPurchaseOrders));
    public static readonly EventId PurchaseOrderFound = new(5006, nameof(PurchaseOrderFound));

    public static readonly EventId PurchaseOrderCreateError = new(5100, nameof(PurchaseOrderCreateError));
    public static readonly EventId PurchaseOrderUpdateError = new(5101, nameof(PurchaseOrderUpdateError));
    public static readonly EventId PurchaseOrderDeleteError = new(5102, nameof(PurchaseOrderDeleteError));
    public static readonly EventId PurchaseOrderCancelError = new(5103, nameof(PurchaseOrderCancelError));
    public static readonly EventId PurchaseOrderCompleteError = new(5104, nameof(PurchaseOrderCompleteError));

    public static readonly EventId PurchaseOrderNotFound = new(5200, nameof(PurchaseOrderNotFound));
    public static readonly EventId PurchaseOrderValidationFailed = new(5201, nameof(PurchaseOrderValidationFailed));
    public static readonly EventId PurchaseOrderValidationFailedHandler = new(5202, nameof(PurchaseOrderValidationFailedHandler));
    public static readonly EventId PurchaseOrderAlreadyExists = new(5203, nameof(PurchaseOrderAlreadyExists));
    public static readonly EventId PurchaseOrderAlreadyCancelled = new(5204, nameof(PurchaseOrderAlreadyCancelled));
    public static readonly EventId PurchaseOrderAlreadyCompleted = new(5205, nameof(PurchaseOrderAlreadyCompleted));
    public static readonly EventId PurchaseOrderAlreadyProcessing = new(5206, nameof(PurchaseOrderAlreadyProcessing));
}
