using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.Customer;

public static class CustomerLogEventIds
{
    public static readonly EventId CustomerCreated = new(9000, nameof(CustomerCreated));
    public static readonly EventId CustomerUpdated = new(9001, nameof(CustomerUpdated));
    public static readonly EventId CustomerDeleted = new(9002, nameof(CustomerDeleted));
    public static readonly EventId ReturnedListOfCustomers = new(9003, nameof(ReturnedListOfCustomers));
    public static readonly EventId CustomerFound = new(9004, nameof(CustomerFound));

    public static readonly EventId CustomerCreateError = new(9100, nameof(CustomerCreateError));
    public static readonly EventId CustomerUpdateError = new(9101, nameof(CustomerUpdateError));
    public static readonly EventId CustomerDeleteError = new(9102, nameof(CustomerDeleteError));

    public static readonly EventId CustomerNotFound = new(9200, nameof(CustomerNotFound));
    public static readonly EventId CustomerValidationFailed = new(9201, nameof(CustomerValidationFailed));
    public static readonly EventId CustomerValidationFailedHandler = new(9202, nameof(CustomerValidationFailedHandler));
    public static readonly EventId CustomerAlreadyExists = new(9203, nameof(CustomerAlreadyExists));
}
