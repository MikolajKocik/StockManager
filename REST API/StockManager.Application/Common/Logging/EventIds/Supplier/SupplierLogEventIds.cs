using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.Supplier;

public static class SupplierLogEventIds
{
    // error
    public static readonly EventId AddingSupplierException = new(30, "AddingSupplierException");
    public static readonly EventId RemovingSupplierException = new(31, "RemovingSupplierException");
    public static readonly EventId EditingSupplierException = new(32, "EditingSupplierException");
    public static readonly EventId RetrievingSupplierById = new(33, "RetrievingSupplierById");
    public static readonly EventId ModifiedSupplierException = new(34, "ModifiedSupplierException");

    // warning
    public static readonly EventId SupplierValidationFailed = new(40, "SupplierValidationFailed");
    public static readonly EventId SupplierNotFound = new(41, "SupplierNotFound");
    public static readonly EventId RemovingSupplierOperation = new(42, "RemovingSupplierOperation");
    public static readonly EventId SupplierAlreadyExists = new (43, "SupplierAlreadyExists");
    public static readonly EventId SupplierNotExists = new (44, "SupplierNotExists");
    public static readonly EventId SupplierValidationFailedHandler = new(44, "SupplierValidationFailedHandler");


    // information
    public static readonly EventId SupplierAddedSuccesfull = new(50, "SupplierAddedSuccesfull");
    public static readonly EventId SuccesfullReturnedListOfSuppliers = new(51, "SuccesfullReturnedListOfSuppliers");
    public static readonly EventId SupplierFoundSuccessfull = new(52, "SupplierFoundSuccessfull");
    public static readonly EventId SupplierModifiedSuccessfull = new(53, "SupplierModifiedSuccessfull");
    public static readonly EventId SupplierRemovedSuccessfull = new(54, "SupplierRemovedSuccessfull");
    public static readonly EventId ReturningNewSupplier = new(55, "ReturningNewSupplier");
    public static readonly EventId RemovingSupplier = new(56, "RemovingSupplier");
    public static readonly EventId ModyfingSupplier = new(57, "ModyfingSupplier");

}
