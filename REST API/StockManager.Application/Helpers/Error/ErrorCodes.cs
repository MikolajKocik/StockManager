namespace StockManager.Application.Helpers.Error;

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
}
