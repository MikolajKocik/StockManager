namespace StockManager.Application.Helpers.Error;

/// <summary>
/// Provides a centralized collection of error codes used throughout the application to represent specific error
/// conditions for various entities and operations.
/// </summary>
/// <remarks>The <see cref="ErrorCodes"/> class defines a set of constant string values that represent error codes
/// for different entities and operations, such as products, suppliers, users, inventory, shipments, stock transactions,
/// purchase orders, sales orders, invoices, and customers. These error codes are typically used in exception handling,
/// logging, and API responses to provide consistent and meaningful error information to clients or users.  Each error
/// code follows a structured naming convention in the format: <c>[Entity].[ErrorType]</c>, where: <list type="bullet">
/// <item> <description><c>[Entity]</c> represents the domain entity (e.g., Product, Supplier, Shipment).</description>
/// </item> <item> <description><c>[ErrorType]</c> represents the type of error (e.g., NotFound, Conflict,
/// Validation).</description> </item> </list>  Example usage: <code> if (product == null) {     throw new
/// NotFoundException(ErrorCodes.ProductNotFound, "The specified product was not found."); } </code></remarks>
public static class ErrorCodes
{
    public const string ProductNotFound = "Product.NotFound";
    public const string ProductConflict = "Product.Conflict";
    public const string ProductValidation = "Product.Validation";
    //
    public const string SupplierNotFound = "Supplier.NotFound";
    public const string SupplierConflict = "Supplier.Conflict";
    public const string SupplierValidation = "Supplier.Validation";
    //
    public const string UserConflict = "User.Conflict";
    public const string UserValidation = "User.Validation";
    public const string UserUnauthorized = "User.Unauthorized";
    //
    public const string InventoryItemNotFound = "InventoryItem.NotFound";
    public const string InventoryItemConflict = "InventoryItem.Conflict";
    public const string InventoryItemValidation = "InventoryItem.Validation";
    public const string InventoryBinLocationNotFound = "InventoryBinLocation.NotFound";
    //
    public const string ShipmentNotFound = "Shipment.NotFound";
    public const string ShipmentConflict = "Shipment.Conflict";
    public const string ShipmentValidation = "Shipment.Validation";
    public const string ShipmentDeleteFailed = "Shipment.DeleteFailed";
    public const string ShipmentUpdateFailed = "Shipment.UpdateFailed";
    public const string ShipmentCreateFailed = "Shipment.CreateFailed";
    public const string ShipmentAlreadyReturned = "Shipment.AlreadyReturned";
    public const string ShipmentAlreadyCancelled = "Shipment.AlreadyCancelled";
    public const string ShipmentAlreadyDelivered = "Shipment.AlreadyDelivered";
    public const string ShipmentAlreadyProcessing = "Shipment.AlreadyProcessing";
    //
    public const string StockTransactionNotFound = "StockTransaction.NotFound";
    public const string StockTransactionConflict = "StockTransaction.Conflict";
    public const string StockTransactionValidation = "StockTransaction.Validation";
    public const string StockTransactionDeleteFailed = "StockTransaction.DeleteFailed";
    public const string StockTransactionUpdateFailed = "StockTransaction.UpdateFailed";
    public const string StockTransactionCreateFailed = "StockTransaction.CreateFailed";
    //
    public const string PurchaseOrderNotFound = "PurchaseOrder.NotFound";
    public const string PurchaseOrderConflict = "PurchaseOrder.Conflict";
    public const string PurchaseOrderValidation = "PurchaseOrder.Validation";
    public const string PurchaseOrderDeleteFailed = "PurchaseOrder.DeleteFailed";
    public const string PurchaseOrderUpdateFailed = "PurchaseOrder.UpdateFailed";
    public const string PurchaseOrderCreateFailed = "PurchaseOrder.CreateFailed";
    public const string PurchaseOrderAlreadyCancelled = "PurchaseOrder.AlreadyCancelled";
    public const string PurchaseOrderAlreadyCompleted = "PurchaseOrder.AlreadyCompleted";
    public const string PurchaseOrderAlreadyProcessing = "PurchaseOrder.AlreadyProcessing";
    //
    public const string SalesOrderNotFound = "SalesOrder.NotFound";
    public const string SalesOrderConflict = "SalesOrder.Conflict";
    public const string SalesOrderValidation = "SalesOrder.Validation";
    public const string SalesOrderDeleteFailed = "SalesOrder.DeleteFailed";
    public const string SalesOrderUpdateFailed = "SalesOrder.UpdateFailed";
    public const string SalesOrderCreateFailed = "SalesOrder.CreateFailed";
    public const string SalesOrderAlreadyCancelled = "SalesOrder.AlreadyCancelled";
    public const string SalesOrderAlreadyCompleted = "SalesOrder.AlreadyCompleted";
    public const string SalesOrderAlreadyProcessing = "SalesOrder.AlreadyProcessing";
    public const string SalesOrderAlreadyDelivered = "SalesOrder.AlreadyDelivered";
    public const string SalesOrderAlreadyReturned = "SalesOrder.AlreadyReturned";
    //
    public const string InvoiceNotFound = "Invoice.NotFound";
    public const string InvoiceConflict = "Invoice.Conflict";
    public const string InvoiceValidation = "Invoice.Validation";
    public const string InvoiceDeleteFailed = "Invoice.DeleteFailed";
    public const string InvoiceUpdateFailed = "Invoice.UpdateFailed";
    public const string InvoiceCreateFailed = "Invoice.CreateFailed";
    public const string InvoiceAlreadyCancelled = "Invoice.AlreadyCancelled";
    public const string InvoiceAlreadyCompleted = "Invoice.AlreadyCompleted";
    public const string InvoiceAlreadyProcessing = "Invoice.AlreadyProcessing";
    //
    public const string CustomerNotFound = "Customer.NotFound";
    public const string CustomerConflict = "Customer.Conflict";
    public const string CustomerValidation = "Customer.Validation";
    public const string CustomerDeleteFailed = "Customer.DeleteFailed";
    public const string CustomerUpdateFailed = "Customer.UpdateFailed";
    public const string CustomerCreateFailed = "Customer.CreateFailed";
    public const string CustomerAlreadyExists = "Customer.AlreadyExists";
}
