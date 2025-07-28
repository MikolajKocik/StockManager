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
}
