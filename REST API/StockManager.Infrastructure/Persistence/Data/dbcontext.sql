IF SCHEMA_ID(N'StockManager') IS NULL EXEC(N'CREATE SCHEMA [StockManager];');
GO


CREATE TABLE [StockManager].[AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [StockManager].[AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [Slug] nvarchar(450) NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [StockManager].[BinLocations] (
    [Id] int NOT NULL IDENTITY,
    [Warehouse] int NOT NULL,
    [Code] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_BinLocations] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [StockManager].[Documents] (
    [Id] int NOT NULL IDENTITY,
    [OperationId] int NOT NULL,
    [DocumentNumber] nvarchar(50) NOT NULL,
    [FileUrl] nvarchar(2048) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Documents] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [StockManager].[DomainRoles] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_DomainRoles] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [StockManager].[FileMetadatas] (
    [Id] int NOT NULL IDENTITY,
    [FileName] nvarchar(255) NOT NULL,
    [BlobUrl] nvarchar(2048) NOT NULL,
    [UploadedAt] datetime2 NOT NULL,
    [OperationId] int NULL,
    CONSTRAINT [PK_FileMetadatas] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [StockManager].[Permissions] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Permissions] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [StockManager].[ReturnOrders] (
    [Id] int NOT NULL IDENTITY,
    [Type] nvarchar(max) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [ReturnDate] datetime2 NOT NULL,
    [SalesOrderId] int NULL,
    [PurchaseOrderId] int NULL,
    CONSTRAINT [PK_ReturnOrders] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [StockManager].[Suppliers] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Slug] nvarchar(max) NOT NULL,
    [AddressId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_Suppliers] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [StockManager].[WarehouseOperations] (
    [Id] int NOT NULL IDENTITY,
    [Type] int NOT NULL,
    [Status] int NOT NULL,
    [Date] datetime2 NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    CONSTRAINT [PK_WarehouseOperations] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [StockManager].[AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [StockManager].[AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [StockManager].[AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [StockManager].[AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [StockManager].[AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [StockManager].[AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [StockManager].[AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [StockManager].[AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [StockManager].[AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [StockManager].[AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [StockManager].[AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [StockManager].[AuditLogs] (
    [Id] int NOT NULL IDENTITY,
    [EntityName] nvarchar(max) NOT NULL,
    [EntityId] int NOT NULL,
    [Action] nvarchar(max) NOT NULL,
    [Timestamp] datetime2 NOT NULL,
    [Changes] nvarchar(max) NOT NULL,
    [ChangedById] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ChangedBy_User_AuditLog] FOREIGN KEY ([ChangedById]) REFERENCES [StockManager].[AspNetUsers] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[RolePermissions] (
    [PermissionId] int NOT NULL,
    [RoleId] int NOT NULL,
    CONSTRAINT [PK_RolePermissions] PRIMARY KEY ([PermissionId], [RoleId]),
    CONSTRAINT [FK_RolePermissions_DomainRoles_PermissionId] FOREIGN KEY ([PermissionId]) REFERENCES [StockManager].[DomainRoles] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_RolePermissions_Permissions_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [StockManager].[Permissions] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[Adresses] (
    [Id] uniqueidentifier NOT NULL,
    [Slug] nvarchar(max) NOT NULL,
    [City] nvarchar(max) NOT NULL,
    [Country] nvarchar(max) NOT NULL,
    [PostalCode] nvarchar(max) NOT NULL,
    [SupplierId] uniqueidentifier NOT NULL,
    [CustomerId] int NOT NULL,
    CONSTRAINT [PK_Adresses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Address_Supplier] FOREIGN KEY ([SupplierId]) REFERENCES [StockManager].[Suppliers] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [StockManager].[Products] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Slug] nvarchar(450) NOT NULL,
    [Genre] nvarchar(max) NOT NULL,
    [Unit] nvarchar(max) NOT NULL,
    [IsDeleted] bit NULL,
    [ExpirationDate] datetime2 NOT NULL,
    [DeliveredAt] datetime2 NOT NULL,
    [Type] nvarchar(max) NOT NULL,
    [BatchNumber] nvarchar(max) NOT NULL,
    [SupplierId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Product_Supplier] FOREIGN KEY ([SupplierId]) REFERENCES [StockManager].[Suppliers] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[PurchaseOrders] (
    [Id] int NOT NULL IDENTITY,
    [OrderDate] datetime2 NOT NULL,
    [ExpectedDate] datetime2 NULL,
    [Status] nvarchar(max) NOT NULL,
    [SupplierId] uniqueidentifier NOT NULL,
    [InvoiceId] int NULL,
    [ReturnOrderId] int NULL,
    CONSTRAINT [PK_PurchaseOrders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PurchaseOrder_Supplier] FOREIGN KEY ([SupplierId]) REFERENCES [StockManager].[Suppliers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_ReturnOrder_PurchaseOrder] FOREIGN KEY ([ReturnOrderId]) REFERENCES [StockManager].[ReturnOrders] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[OperationItems] (
    [Id] int NOT NULL IDENTITY,
    [OperationId] int NOT NULL,
    [ProductId] int NOT NULL,
    [Quantity] decimal(18,4) NOT NULL,
    CONSTRAINT [PK_OperationItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OperationItems_WarehouseOperations_OperationId] FOREIGN KEY ([OperationId]) REFERENCES [StockManager].[WarehouseOperations] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [StockManager].[Customers] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [TaxId] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [Phone] nvarchar(max) NOT NULL,
    [AddressId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_Customers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Address_Customer] FOREIGN KEY ([AddressId]) REFERENCES [StockManager].[Adresses] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [StockManager].[InventoryItems] (
    [Id] int NOT NULL IDENTITY,
    [Warehouse] nvarchar(max) NOT NULL,
    [QuantityOnHand] decimal(18,2) NOT NULL,
    [QuantityReserved] decimal(18,2) NOT NULL,
    [ProductId] int NOT NULL,
    [BinLocationId] int NOT NULL,
    CONSTRAINT [PK_InventoryItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_InvetoryItem_BinLocation] FOREIGN KEY ([BinLocationId]) REFERENCES [StockManager].[BinLocations] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Product_InventoryItem] FOREIGN KEY ([ProductId]) REFERENCES [StockManager].[Products] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[ReorderRules] (
    [Id] int NOT NULL IDENTITY,
    [Warehouse] nvarchar(max) NOT NULL,
    [MinLevel] decimal(18,2) NOT NULL,
    [MaxLevel] decimal(18,2) NOT NULL,
    [ProductId] int NOT NULL,
    CONSTRAINT [PK_ReorderRules] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Product_ReorderRules] FOREIGN KEY ([ProductId]) REFERENCES [StockManager].[Products] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[ReturnOrderLines] (
    [Id] int NOT NULL IDENTITY,
    [ReturnOrderId] int NOT NULL,
    [Quantity] decimal(18,2) NOT NULL,
    [UoM] nvarchar(max) NOT NULL,
    [ProductId] int NOT NULL,
    CONSTRAINT [PK_ReturnOrderLines] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Product_ReturnOrderLine] FOREIGN KEY ([ProductId]) REFERENCES [StockManager].[Products] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_ReturnOrder_ReturnOrderLine] FOREIGN KEY ([ReturnOrderId]) REFERENCES [StockManager].[ReturnOrders] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[PurchaseOrderLines] (
    [Id] int NOT NULL IDENTITY,
    [Quantity] decimal(18,2) NOT NULL,
    [UoM] nvarchar(max) NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [ProductId] int NOT NULL,
    [PurchaseOrderId] int NOT NULL,
    CONSTRAINT [PK_PurchaseOrderLines] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Product_PurchaseOrderLine] FOREIGN KEY ([ProductId]) REFERENCES [StockManager].[Products] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_PurchaseOrder_PurchaseOrderLine] FOREIGN KEY ([PurchaseOrderId]) REFERENCES [StockManager].[PurchaseOrders] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[SalesOrders] (
    [Id] int NOT NULL IDENTITY,
    [OrderDate] datetime2 NOT NULL,
    [ShipDate] datetime2 NULL,
    [DeliveredDate] datetime2 NULL,
    [CancelDate] datetime2 NULL,
    [Status] nvarchar(max) NOT NULL,
    [CustomerId] int NOT NULL,
    [InvoiceId] int NOT NULL,
    [ReturnOrderId] int NULL,
    CONSTRAINT [PK_SalesOrders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ReturnOrder_SalesOrder] FOREIGN KEY ([ReturnOrderId]) REFERENCES [StockManager].[ReturnOrders] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_SalesOrder_Customer] FOREIGN KEY ([CustomerId]) REFERENCES [StockManager].[Customers] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[StockTransactions] (
    [Id] int NOT NULL IDENTITY,
    [Type] nvarchar(450) NOT NULL,
    [Quantity] decimal(18,2) NOT NULL,
    [Date] date NOT NULL,
    [SourceLocationId] int NULL,
    [TargetLocationId] int NULL,
    [ReferenceNumber] nvarchar(100) NOT NULL,
    [InventoryItemId] int NOT NULL,
    CONSTRAINT [PK_StockTransactions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_InventoryItem_StockTransaction] FOREIGN KEY ([InventoryItemId]) REFERENCES [StockManager].[InventoryItems] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[Invoices] (
    [Id] int NOT NULL IDENTITY,
    [Type] nvarchar(max) NOT NULL,
    [InvoiceDate] datetime2 NOT NULL,
    [DueDate] datetime2 NULL,
    [Status] nvarchar(max) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [PurchaseOrderId] int NULL,
    [SalesOrderId] int NULL,
    CONSTRAINT [PK_Invoices] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PurchaseOrder_Invoice] FOREIGN KEY ([PurchaseOrderId]) REFERENCES [StockManager].[PurchaseOrders] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_SalesOrder_Invoice] FOREIGN KEY ([SalesOrderId]) REFERENCES [StockManager].[SalesOrders] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[SalesOrderLines] (
    [Id] int NOT NULL IDENTITY,
    [Quantity] decimal(18,2) NOT NULL,
    [UoM] nvarchar(max) NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [ProductId] int NOT NULL,
    [SalesOrderId] int NOT NULL,
    CONSTRAINT [PK_SalesOrderLines] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Product_SalesOrderLine] FOREIGN KEY ([ProductId]) REFERENCES [StockManager].[Products] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_SalesOrder_SalesOrderLine] FOREIGN KEY ([SalesOrderId]) REFERENCES [StockManager].[SalesOrders] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [StockManager].[Shipments] (
    [Id] int NOT NULL IDENTITY,
    [TrackingNumber] nvarchar(max) NOT NULL,
    [Status] int NOT NULL,
    [ShippedDate] datetime2 NOT NULL,
    [DeliveredDate] datetime2 NULL,
    [SalesOrderId] int NOT NULL,
    CONSTRAINT [PK_Shipments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SalesOrder_Shipment] FOREIGN KEY ([SalesOrderId]) REFERENCES [StockManager].[SalesOrders] ([Id]) ON DELETE NO ACTION
);
GO


CREATE UNIQUE INDEX [IX_Adresses_SupplierId] ON [StockManager].[Adresses] ([SupplierId]);
GO


CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [StockManager].[AspNetRoleClaims] ([RoleId]);
GO


CREATE UNIQUE INDEX [RoleNameIndex] ON [StockManager].[AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
GO


CREATE INDEX [IX_AspNetUserClaims_UserId] ON [StockManager].[AspNetUserClaims] ([UserId]);
GO


CREATE INDEX [IX_AspNetUserLogins_UserId] ON [StockManager].[AspNetUserLogins] ([UserId]);
GO


CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [StockManager].[AspNetUserRoles] ([RoleId]);
GO


CREATE INDEX [EmailIndex] ON [StockManager].[AspNetUsers] ([NormalizedEmail]);
GO


CREATE UNIQUE INDEX [IX_AspNetUsers_Slug] ON [StockManager].[AspNetUsers] ([Slug]);
GO


CREATE UNIQUE INDEX [UserNameIndex] ON [StockManager].[AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
GO


CREATE INDEX [IX_AuditLogs_ChangedById] ON [StockManager].[AuditLogs] ([ChangedById]);
GO


CREATE UNIQUE INDEX [IX_Customers_AddressId] ON [StockManager].[Customers] ([AddressId]);
GO


CREATE INDEX [IX_InventoryItems_BinLocationId] ON [StockManager].[InventoryItems] ([BinLocationId]);
GO


CREATE INDEX [IX_InventoryItems_ProductId] ON [StockManager].[InventoryItems] ([ProductId]);
GO


CREATE UNIQUE INDEX [IX_Invoices_PurchaseOrderId] ON [StockManager].[Invoices] ([PurchaseOrderId]) WHERE [PurchaseOrderId] IS NOT NULL;
GO


CREATE UNIQUE INDEX [IX_Invoices_SalesOrderId] ON [StockManager].[Invoices] ([SalesOrderId]) WHERE [SalesOrderId] IS NOT NULL;
GO


CREATE INDEX [IX_OperationItems_OperationId] ON [StockManager].[OperationItems] ([OperationId]);
GO


CREATE UNIQUE INDEX [IX_Products_Slug] ON [StockManager].[Products] ([Slug]);
GO


CREATE INDEX [IX_Products_SupplierId] ON [StockManager].[Products] ([SupplierId]);
GO


CREATE INDEX [IX_PurchaseOrderLines_ProductId] ON [StockManager].[PurchaseOrderLines] ([ProductId]);
GO


CREATE INDEX [IX_PurchaseOrderLines_PurchaseOrderId] ON [StockManager].[PurchaseOrderLines] ([PurchaseOrderId]);
GO


CREATE UNIQUE INDEX [IX_PurchaseOrders_ReturnOrderId] ON [StockManager].[PurchaseOrders] ([ReturnOrderId]) WHERE [ReturnOrderId] IS NOT NULL;
GO


CREATE INDEX [IX_PurchaseOrders_SupplierId] ON [StockManager].[PurchaseOrders] ([SupplierId]);
GO


CREATE INDEX [IX_ReorderRules_ProductId] ON [StockManager].[ReorderRules] ([ProductId]);
GO


CREATE INDEX [IX_ReturnOrderLines_ProductId] ON [StockManager].[ReturnOrderLines] ([ProductId]);
GO


CREATE INDEX [IX_ReturnOrderLines_ReturnOrderId] ON [StockManager].[ReturnOrderLines] ([ReturnOrderId]);
GO


CREATE INDEX [IX_RolePermissions_RoleId] ON [StockManager].[RolePermissions] ([RoleId]);
GO


CREATE INDEX [IX_SalesOrderLines_ProductId] ON [StockManager].[SalesOrderLines] ([ProductId]);
GO


CREATE INDEX [IX_SalesOrderLines_SalesOrderId] ON [StockManager].[SalesOrderLines] ([SalesOrderId]);
GO


CREATE INDEX [IX_SalesOrders_CustomerId] ON [StockManager].[SalesOrders] ([CustomerId]);
GO


CREATE UNIQUE INDEX [IX_SalesOrders_ReturnOrderId] ON [StockManager].[SalesOrders] ([ReturnOrderId]) WHERE [ReturnOrderId] IS NOT NULL;
GO


CREATE INDEX [IX_Shipments_SalesOrderId] ON [StockManager].[Shipments] ([SalesOrderId]);
GO


CREATE UNIQUE INDEX [UX_StockTransaction_BusinessKey] ON [StockManager].[StockTransactions] ([InventoryItemId], [Type], [Date], [ReferenceNumber], [SourceLocationId], [TargetLocationId]) WHERE [SourceLocationId] IS NOT NULL AND [TargetLocationId] IS NOT NULL;
GO


