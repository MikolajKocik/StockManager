-- SQL Seed Data for StockManager WMS
-- Run this script to populate the database with realistic test data.

USE [StockManagerDb];
GO

DELETE FROM [StockManager].[OperationItems];
DELETE FROM [StockManager].[WarehouseOperations];
DELETE FROM [StockManager].[InventoryItems];
DELETE FROM [StockManager].[Products];
DELETE FROM [StockManager].[Customers];
DELETE FROM [StockManager].[Suppliers];
DELETE FROM [StockManager].[Adresses];
DELETE FROM [StockManager].[BinLocations];

BEGIN TRANSACTION;

-- 1. BIN LOCATIONS
SET IDENTITY_INSERT [StockManager].[BinLocations] ON;
INSERT INTO [StockManager].[BinLocations] ([Id], [Warehouse], [Code], [Description]) VALUES 
(1, 0, 'R-01-A-01', 'Regular Storage, Aisle 1, Rack A, Level 1'),
(2, 0, 'R-01-A-02', 'Regular Storage, Aisle 1, Rack A, Level 2'),
(3, 0, 'R-02-B-01', 'Regular Storage, Aisle 2, Rack B, Level 1'),
(4, 1, 'REF-01-A', 'Refrigerated Section Zone A'),
(5, 1, 'REF-01-B', 'Refrigerated Section Zone B'),
(6, 2, 'FRZ-01', 'Freezer Section Main'),
(7, 3, 'OUT-01', 'Outdoor Storage Area 1');
SET IDENTITY_INSERT [StockManager].[BinLocations] OFF;

-- 2. SUPPLIERS & THEIR ADDRESSES
DECLARE @Supp1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Addr1 UNIQUEIDENTIFIER = NEWID();
INSERT INTO [StockManager].[Suppliers] ([Id], [Name], [Slug], [AddressId]) VALUES (@Supp1, 'FreshGrains Sp. z o.o.', 'supp-01', @Addr1);
INSERT INTO [StockManager].[Adresses] ([Id], [Slug], [City], [Country], [PostalCode], [SupplierId], [CustomerId]) VALUES (@Addr1, 'addr-supp-01', 'Warsaw', 'Poland', '00-001', @Supp1, 0);

DECLARE @Supp2 UNIQUEIDENTIFIER = NEWID();
DECLARE @Addr2 UNIQUEIDENTIFIER = NEWID();
INSERT INTO [StockManager].[Suppliers] ([Id], [Name], [Slug], [AddressId]) VALUES (@Supp2, 'Global Logistics & Supply', 'supp-02', @Addr2);
INSERT INTO [StockManager].[Adresses] ([Id], [Slug], [City], [Country], [PostalCode], [SupplierId], [CustomerId]) VALUES (@Addr2, 'addr-supp-02', 'Berlin', 'Germany', '10115', @Supp2, 0);

DECLARE @Supp3 UNIQUEIDENTIFIER = NEWID();
DECLARE @Addr3 UNIQUEIDENTIFIER = NEWID();
INSERT INTO [StockManager].[Suppliers] ([Id], [Name], [Slug], [AddressId]) VALUES (@Supp3, 'Pol-Meat S.A.', 'supp-03', @Addr3);
INSERT INTO [StockManager].[Adresses] ([Id], [Slug], [City], [Country], [PostalCode], [SupplierId], [CustomerId]) VALUES (@Addr3, 'addr-supp-03', 'Krakow', 'Poland', '31-001', @Supp3, 0);

-- 3. CUSTOMERS & THEIR ADDRESSES 
DECLARE @ShadowSuppCust1 UNIQUEIDENTIFIER = NEWID();
DECLARE @AddrCust1 UNIQUEIDENTIFIER = NEWID();
INSERT INTO [StockManager].[Suppliers] ([Id], [Name], [Slug], [AddressId]) VALUES (@ShadowSuppCust1, 'Shadow For Customer 1', 'shadow-01', @AddrCust1);
INSERT INTO [StockManager].[Adresses] ([Id], [Slug], [City], [Country], [PostalCode], [SupplierId], [CustomerId]) VALUES (@AddrCust1, 'addr-cust-01', 'Gdansk', 'Poland', '80-001', @ShadowSuppCust1, 1);
SET IDENTITY_INSERT [StockManager].[Customers] ON;
INSERT INTO [StockManager].[Customers] ([Id], [Name], [TaxId], [Email], [Phone], [AddressId]) VALUES (1, 'Local Market Alpha', 'PL1234567890', 'contact@marketalpha.pl', '+48 500 100 200', @AddrCust1);
SET IDENTITY_INSERT [StockManager].[Customers] OFF;

DECLARE @ShadowSuppCust2 UNIQUEIDENTIFIER = NEWID();
DECLARE @AddrCust2 UNIQUEIDENTIFIER = NEWID();
INSERT INTO [StockManager].[Suppliers] ([Id], [Name], [Slug], [AddressId]) VALUES (@ShadowSuppCust2, 'Shadow For Customer 2', 'shadow-02', @AddrCust2);
INSERT INTO [StockManager].[Adresses] ([Id], [Slug], [City], [Country], [PostalCode], [SupplierId], [CustomerId]) VALUES (@AddrCust2, 'addr-cust-02', 'Wroclaw', 'Poland', '50-001', @ShadowSuppCust2, 2);
SET IDENTITY_INSERT [StockManager].[Customers] ON;
INSERT INTO [StockManager].[Customers] ([Id], [Name], [TaxId], [Email], [Phone], [AddressId]) VALUES (2, 'Retail Chain Delta', 'PL0987654321', 'office@delta-retail.com', '+48 600 300 400', @AddrCust2);
SET IDENTITY_INSERT [StockManager].[Customers] OFF;

-- 4. PRODUCTS
SET IDENTITY_INSERT [StockManager].[Products] ON;
INSERT INTO [StockManager].[Products] ([Id], [Name], [Slug], [Genre], [Unit], [ExpirationDate], [DeliveredAt], [Type], [BatchNumber], [SupplierId]) VALUES
(1, 'Organic Carrots', 'prod-001', 'Vegetables', 'kg', DATEADD(day, 14, GETDATE()), GETDATE(), 'RegularStorage', 'BATCH-2024-001', @Supp1),
(2, 'Red Apples', 'prod-002', 'Fruits', 'kg', DATEADD(day, 30, GETDATE()), GETDATE(), 'RegularStorage', 'BATCH-2024-002', @Supp1),
(3, 'Whole Milk 3.2%', 'prod-003', 'Dairy', 'liter', DATEADD(day, 7, GETDATE()), GETDATE(), 'RefrigeratedSection', 'BATCH-MLK-01', @Supp2),
(4, 'Unsalted Butter', 'prod-004', 'Dairy', 'pcs', DATEADD(day, 60, GETDATE()), GETDATE(), 'RefrigeratedSection', 'BATCH-BTR-01', @Supp2),
(5, 'Frozen Ground Beef', 'prod-005', 'Meat', 'kg', DATEADD(month, 6, GETDATE()), GETDATE(), 'FreezerSection', 'BATCH-BEEF-99', @Supp3),
(6, 'Chicken Breast', 'prod-006', 'Meat', 'kg', DATEADD(day, 5, GETDATE()), GETDATE(), 'RefrigeratedSection', 'BATCH-CHK-01', @Supp3),
(7, 'Wheat Flour 1kg', 'prod-007', 'DryProducts', 'pcs', DATEADD(year, 1, GETDATE()), GETDATE(), 'RegularStorage', 'FLR-2024-X', @Supp1),
(8, 'Pasta Penne', 'prod-008', 'DryProducts', 'pcs', DATEADD(year, 2, GETDATE()), GETDATE(), 'RegularStorage', 'PST-2024-A', @Supp1),
(9, 'Frozen Salmon Fillets', 'prod-009', 'Fish', 'kg', DATEADD(month, 12, GETDATE()), GETDATE(), 'FreezerSection', 'SLM-FRZ-01', @Supp3),
(10, 'Plain Yogurt', 'prod-010', 'Dairy', 'pcs', DATEADD(day, 10, GETDATE()), GETDATE(), 'RefrigeratedSection', 'YGR-PLN-01', @Supp2);
SET IDENTITY_INSERT [StockManager].[Products] OFF;

-- 5. INVENTORY ITEMS
INSERT INTO [StockManager].[InventoryItems] ([Warehouse], [QuantityOnHand], [QuantityReserved], [ProductId], [BinLocationId]) VALUES
('RegularStorage', 500.0, 50.0, 1, 1),
('RegularStorage', 300.0, 0.0, 2, 2),
('RefrigeratedSection', 200.0, 20.0, 3, 4),
('RefrigeratedSection', 150.0, 10.0, 4, 5),
('FreezerSection', 1000.0, 100.0, 5, 6),
('RegularStorage', 1200.0, 0.0, 7, 3),
('FreezerSection', 400.0, 0.0, 9, 6);

-- 6. WAREHOUSE OPERATIONS
DECLARE @OpId1 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (0, 1, DATEADD(day, -5, GETDATE()), 'Initial delivery of dairy products');
SET @OpId1 = SCOPE_IDENTITY();

INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId1, 3, 200), (@OpId1, 4, 150);

DECLARE @OpId2 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (1, 0, GETDATE(), 'Sales order shipment for market alpha');
SET @OpId2 = SCOPE_IDENTITY();

INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId2, 1, 50), (@OpId2, 2, 30);

COMMIT;
PRINT 'Seed successful! Database populated.';
GO
