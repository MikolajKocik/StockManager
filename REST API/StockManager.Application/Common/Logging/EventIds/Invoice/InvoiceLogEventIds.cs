using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.Invoice;

public static class InvoiceLogEventIds
{
    public static readonly EventId InvoiceCreated = new(8000, nameof(InvoiceCreated));
    public static readonly EventId InvoiceUpdated = new(8001, nameof(InvoiceUpdated));
    public static readonly EventId InvoiceDeleted = new(8002, nameof(InvoiceDeleted));
    public static readonly EventId InvoiceCancelled = new(8003, nameof(InvoiceCancelled));
    public static readonly EventId InvoiceCompleted = new(8004, nameof(InvoiceCompleted));
    public static readonly EventId InvoiceIssued = new(8005, nameof(InvoiceIssued));
    public static readonly EventId ReturnedListOfInvoices = new(8006, nameof(ReturnedListOfInvoices));
    public static readonly EventId InvoiceFound = new(8007, nameof(InvoiceFound));
    public static readonly EventId InvoicePayed = new(8008, nameof(InvoicePayed));

    public static readonly EventId InvoiceCreateError = new(8100, nameof(InvoiceCreateError));
    public static readonly EventId InvoiceUpdateError = new(8101, nameof(InvoiceUpdateError));
    public static readonly EventId InvoiceDeleteError = new(8102, nameof(InvoiceDeleteError));
    public static readonly EventId InvoiceCancelError = new(8103, nameof(InvoiceCancelError));
    public static readonly EventId InvoiceCompleteError = new(8104, nameof(InvoiceCompleteError));

    public static readonly EventId InvoiceNotFound = new(8200, nameof(InvoiceNotFound));
    public static readonly EventId InvoiceValidationFailed = new(8201, nameof(InvoiceValidationFailed));
    public static readonly EventId InvoiceValidationFailedHandler = new(8202, nameof(InvoiceValidationFailedHandler));
    public static readonly EventId InvoiceAlreadyExists = new(8203, nameof(InvoiceAlreadyExists));
    public static readonly EventId InvoiceAlreadyCancelled = new(8204, nameof(InvoiceAlreadyCancelled));
    public static readonly EventId InvoiceAlreadyCompleted = new(8205, nameof(InvoiceAlreadyCompleted));
    public static readonly EventId InvoiceAlreadyProcessing = new(8206, nameof(InvoiceAlreadyProcessing));
}
