-- SQL Seed Data for StockManager WMS
-- Run this script to populate the database with realistic test data.

USE [StockManagerDb];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

DELETE FROM [StockManager].[SalesOrderLines];
DELETE FROM [StockManager].[PurchaseOrderLines];
DELETE FROM [StockManager].[Invoices];
DELETE FROM [StockManager].[SalesOrders];
DELETE FROM [StockManager].[PurchaseOrders];
DELETE FROM [StockManager].[OperationItems];
DELETE FROM [StockManager].[WarehouseOperations];
DELETE FROM [StockManager].[InventoryItems];
DELETE FROM [StockManager].[Products];
DELETE FROM [StockManager].[Customers];
DELETE FROM [StockManager].[Suppliers];
DELETE FROM [StockManager].[Adresses];
DELETE FROM [StockManager].[BinLocations];

BEGIN TRANSACTION;

-- 1. BIN LOCATIONS (32 locations across 4 warehouse zones)
SET IDENTITY_INSERT [StockManager].[BinLocations] ON;
INSERT INTO [StockManager].[BinLocations] ([Id], [Warehouse], [Code], [Description]) VALUES 
-- RegularStorage (0)
(1, 0, 'R-01-A-01', 'Regular Storage, Aisle 1, Rack A, Level 1'),
(2, 0, 'R-01-A-02', 'Regular Storage, Aisle 1, Rack A, Level 2'),
(3, 0, 'R-01-B-01', 'Regular Storage, Aisle 1, Rack B, Level 1'),
(4, 0, 'R-01-B-02', 'Regular Storage, Aisle 1, Rack B, Level 2'),
(5, 0, 'R-02-A-01', 'Regular Storage, Aisle 2, Rack A, Level 1'),
(6, 0, 'R-02-A-02', 'Regular Storage, Aisle 2, Rack A, Level 2'),
(7, 0, 'R-02-B-01', 'Regular Storage, Aisle 2, Rack B, Level 1'),
(8, 0, 'R-02-B-02', 'Regular Storage, Aisle 2, Rack B, Level 2'),
(9, 0, 'R-03-A-01', 'Regular Storage, Aisle 3, Rack A, Level 1'),
(10, 0, 'R-03-A-02', 'Regular Storage, Aisle 3, Rack A, Level 2'),
-- RefrigeratedSection (1)
(11, 1, 'REF-01-A-01', 'Refrigerated Section Zone A Level 1'),
(12, 1, 'REF-01-A-02', 'Refrigerated Section Zone A Level 2'),
(13, 1, 'REF-01-B-01', 'Refrigerated Section Zone B Level 1'),
(14, 1, 'REF-01-B-02', 'Refrigerated Section Zone B Level 2'),
(15, 1, 'REF-02-A-01', 'Refrigerated Section Zone C Level 1'),
(16, 1, 'REF-02-A-02', 'Refrigerated Section Zone C Level 2'),
-- FreezerSection (2)
(17, 2, 'FRZ-01-A-01', 'Freezer Zone A Level 1'),
(18, 2, 'FRZ-01-A-02', 'Freezer Zone A Level 2'),
(19, 2, 'FRZ-01-B-01', 'Freezer Zone B Level 1'),
(20, 2, 'FRZ-01-B-02', 'Freezer Zone B Level 2'),
(21, 2, 'FRZ-02-A-01', 'Freezer Zone C Level 1'),
(22, 2, 'FRZ-02-A-02', 'Freezer Zone C Level 2'),
-- OutdoorStorage (3)
(23, 3, 'OUT-01-01', 'Outdoor Area 1 Slot 1'),
(24, 3, 'OUT-01-02', 'Outdoor Area 1 Slot 2'),
(25, 3, 'OUT-02-01', 'Outdoor Area 2 Slot 1'),
(26, 3, 'OUT-02-02', 'Outdoor Area 2 Slot 2'),
(27, 3, 'OUT-03-01', 'Outdoor Area 3 Slot 1'),
(28, 3, 'OUT-03-02', 'Outdoor Area 3 Slot 2'),
(29, 0, 'R-04-A-01', 'Regular Storage, Aisle 4, Rack A, Level 1'),
(30, 0, 'R-04-A-02', 'Regular Storage, Aisle 4, Rack A, Level 2'),
(31, 1, 'REF-03-A-01', 'Refrigerated Section Zone D Level 1'),
(32, 2, 'FRZ-03-A-01', 'Freezer Zone D Level 1');
SET IDENTITY_INSERT [StockManager].[BinLocations] OFF;

-- 2. SUPPLIERS & THEIR ADDRESSES (5 Suppliers)
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

DECLARE @Supp4 UNIQUEIDENTIFIER = NEWID();
DECLARE @Addr4 UNIQUEIDENTIFIER = NEWID();
INSERT INTO [StockManager].[Suppliers] ([Id], [Name], [Slug], [AddressId]) VALUES (@Supp4, 'Nordic Fish Export', 'supp-04', @Addr4);
INSERT INTO [StockManager].[Adresses] ([Id], [Slug], [City], [Country], [PostalCode], [SupplierId], [CustomerId]) VALUES (@Addr4, 'addr-supp-04', 'Oslo', 'Norway', '0150', @Supp4, 0);

DECLARE @Supp5 UNIQUEIDENTIFIER = NEWID();
DECLARE @Addr5 UNIQUEIDENTIFIER = NEWID();
INSERT INTO [StockManager].[Suppliers] ([Id], [Name], [Slug], [AddressId]) VALUES (@Supp5, 'BioHortus Growers', 'supp-05', @Addr5);
INSERT INTO [StockManager].[Adresses] ([Id], [Slug], [City], [Country], [PostalCode], [SupplierId], [CustomerId]) VALUES (@Addr5, 'addr-supp-05', 'Madrid', 'Spain', '28001', @Supp5, 0);


-- 3. CUSTOMERS & THEIR ADDRESSES (5 Customers)
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

DECLARE @ShadowSuppCust3 UNIQUEIDENTIFIER = NEWID();
DECLARE @AddrCust3 UNIQUEIDENTIFIER = NEWID();
INSERT INTO [StockManager].[Suppliers] ([Id], [Name], [Slug], [AddressId]) VALUES (@ShadowSuppCust3, 'Shadow For Customer 3', 'shadow-03', @AddrCust3);
INSERT INTO [StockManager].[Adresses] ([Id], [Slug], [City], [Country], [PostalCode], [SupplierId], [CustomerId]) VALUES (@AddrCust3, 'addr-cust-03', 'Poznan', 'Poland', '60-001', @ShadowSuppCust3, 3);
SET IDENTITY_INSERT [StockManager].[Customers] ON;
INSERT INTO [StockManager].[Customers] ([Id], [Name], [TaxId], [Email], [Phone], [AddressId]) VALUES (3, 'EuroFood distribution', 'PL1122334455', 'sales@eurofood.pl', '+48 700 800 900', @AddrCust3);
SET IDENTITY_INSERT [StockManager].[Customers] OFF;

DECLARE @ShadowSuppCust4 UNIQUEIDENTIFIER = NEWID();
DECLARE @AddrCust4 UNIQUEIDENTIFIER = NEWID();
INSERT INTO [StockManager].[Suppliers] ([Id], [Name], [Slug], [AddressId]) VALUES (@ShadowSuppCust4, 'Shadow For Customer 4', 'shadow-04', @AddrCust4);
INSERT INTO [StockManager].[Adresses] ([Id], [Slug], [City], [Country], [PostalCode], [SupplierId], [CustomerId]) VALUES (@AddrCust4, 'addr-cust-04', 'Lodz', 'Poland', '90-001', @ShadowSuppCust4, 4);
SET IDENTITY_INSERT [StockManager].[Customers] ON;
INSERT INTO [StockManager].[Customers] ([Id], [Name], [TaxId], [Email], [Phone], [AddressId]) VALUES (4, 'Gourmet House', 'PL9988776655', 'order@gourmethouse.pl', '+48 660 770 880', @AddrCust4);
SET IDENTITY_INSERT [StockManager].[Customers] OFF;

DECLARE @ShadowSuppCust5 UNIQUEIDENTIFIER = NEWID();
DECLARE @AddrCust5 UNIQUEIDENTIFIER = NEWID();
INSERT INTO [StockManager].[Suppliers] ([Id], [Name], [Slug], [AddressId]) VALUES (@ShadowSuppCust5, 'Shadow For Customer 5', 'shadow-05', @AddrCust5);
INSERT INTO [StockManager].[Adresses] ([Id], [Slug], [City], [Country], [PostalCode], [SupplierId], [CustomerId]) VALUES (@AddrCust5, 'addr-cust-05', 'Katowice', 'Poland', '40-001', @ShadowSuppCust5, 5);
SET IDENTITY_INSERT [StockManager].[Customers] ON;
INSERT INTO [StockManager].[Customers] ([Id], [Name], [TaxId], [Email], [Phone], [AddressId]) VALUES (5, 'Hypermarket Center', 'PL5544332211', 'logistics@hypercenter.pl', '+48 322 100 200', @AddrCust5);
SET IDENTITY_INSERT [StockManager].[Customers] OFF;


-- 4. PRODUCTS (20 Products)
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
(9, 'Frozen Salmon Fillets', 'prod-009', 'Fish', 'kg', DATEADD(month, 12, GETDATE()), GETDATE(), 'FreezerSection', 'SLM-FRZ-01', @Supp4),
(10, 'Plain Yogurt', 'prod-010', 'Dairy', 'pcs', DATEADD(day, 10, GETDATE()), GETDATE(), 'RefrigeratedSection', 'YGR-PLN-01', @Supp2),
(11, 'Spanish Olive Oil', 'prod-011', 'DryProducts', 'liter', DATEADD(year, 2, GETDATE()), GETDATE(), 'RegularStorage', 'OIL-ESP-202', @Supp5),
(12, 'Ice Cream Vanilla', 'prod-012', 'Dairy', 'pcs', DATEADD(month, 8, GETDATE()), GETDATE(), 'FreezerSection', 'ICE-VAN-55', @Supp2),
(13, 'Frozen Cod Fillets', 'prod-013', 'Fish', 'kg', DATEADD(month, 10, GETDATE()), GETDATE(), 'FreezerSection', 'COD-FRZ-02', @Supp4),
(14, 'Cheddar Cheese 200g', 'prod-014', 'Dairy', 'pcs', DATEADD(day, 90, GETDATE()), GETDATE(), 'RefrigeratedSection', 'CHD-200-Z', @Supp2),
(15, 'Pork Chops', 'prod-015', 'Meat', 'kg', DATEADD(day, 6, GETDATE()), GETDATE(), 'RefrigeratedSection', 'PRK-CHP-01', @Supp3),
(16, 'Frozen Broccoli', 'prod-016', 'Vegetables', 'kg', DATEADD(month, 12, GETDATE()), GETDATE(), 'FreezerSection', 'BRC-FRZ-01', @Supp5),
(17, 'White Rice 1kg', 'prod-017', 'DryProducts', 'pcs', DATEADD(year, 3, GETDATE()), GETDATE(), 'RegularStorage', 'RCE-WHT-10', @Supp1),
(18, 'Sparkling Water 1.5L', 'prod-018', 'DryProducts', 'pcs', DATEADD(year, 1, GETDATE()), GETDATE(), 'RegularStorage', 'WAT-SPK-01', @Supp2),
(19, 'Tomato Puree', 'prod-019', 'Vegetables', 'pcs', DATEADD(year, 2, GETDATE()), GETDATE(), 'RegularStorage', 'TOM-PUR-88', @Supp5),
(20, 'Frozen French Fries', 'prod-020', 'Vegetables', 'kg', DATEADD(month, 18, GETDATE()), GETDATE(), 'FreezerSection', 'FFY-FRZ-01', @Supp1);
SET IDENTITY_INSERT [StockManager].[Products] OFF;


-- 5. INVENTORY ITEMS (25 items with diverse quantity percentages for the UI)
INSERT INTO [StockManager].[InventoryItems] ([Warehouse], [QuantityOnHand], [QuantityReserved], [ProductId], [BinLocationId]) VALUES
-- RegularStorage (Capacity threshold = 500.0)
('RegularStorage', 450.0, 50.0, 1, 1),   -- 90% usage
('RegularStorage', 200.0, 0.0, 2, 2),    -- 40% usage
('RegularStorage', 15.0, 0.0, 7, 3),      -- 3% usage (critical alert!)
('RegularStorage', 500.0, 100.0, 8, 4),   -- 100% usage (full capacity)
('RegularStorage', 350.0, 20.0, 11, 5),   -- 70% usage
('RegularStorage', 120.0, 10.0, 17, 6),   -- 24% usage
('RegularStorage', 250.0, 0.0, 18, 7),    -- 50% usage
('RegularStorage', 80.0, 0.0, 19, 8),     -- 16% usage
('RegularStorage', 380.0, 40.0, 1, 9),    -- 76% usage
('RegularStorage', 90.0, 5.0, 2, 10),     -- 18% usage

-- RefrigeratedSection (Capacity threshold = 500.0)
('RefrigeratedSection', 250.0, 50.0, 3, 11),  -- 50% usage
('RefrigeratedSection', 420.0, 20.0, 4, 12),  -- 84% usage
('RefrigeratedSection', 30.0, 10.0, 6, 13),   -- 6% usage (critical alert!)
('RefrigeratedSection', 180.0, 0.0, 10, 14),  -- 36% usage
('RefrigeratedSection', 490.0, 90.0, 14, 15), -- 98% usage (near full)
('RefrigeratedSection', 300.0, 10.0, 15, 16), -- 60% usage

-- FreezerSection (Capacity threshold = 500.0)
('FreezerSection', 120.0, 0.0, 5, 17),    -- 24% usage
('FreezerSection', 500.0, 150.0, 9, 18),  -- 100% usage
('FreezerSection', 450.0, 50.0, 12, 19),  -- 90% usage
('FreezerSection', 75.0, 0.0, 13, 20),    -- 15% usage
('FreezerSection', 320.0, 20.0, 16, 21),  -- 64% usage
('FreezerSection', 220.0, 10.0, 20, 22),  -- 44% usage

-- OutdoorStorage (Capacity threshold = 500.0)
('OutdoorStorage', 400.0, 0.0, 18, 23),   -- 80% usage
('OutdoorStorage', 150.0, 0.0, 11, 24),   -- 30% usage
('OutdoorStorage', 20.0, 0.0, 7, 25);     -- 4% usage (critical alert!)


-- 6. WAREHOUSE OPERATIONS & ITEMS (12 Operations: Pending, Completed, Cancelled)
-- PZ = 0 (Receive), WZ = 1 (Ship), RW = 2 (Internal), MM = 3 (Move)
-- Status: 0 = Pending, 1 = Completed, 2 = Cancelled

DECLARE @OpId1 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (0, 1, DATEADD(day, -10, GETDATE()), 'Delivery of Spanish olive oil and tomato puree');
SET @OpId1 = SCOPE_IDENTITY();
INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId1, 11, 350), (@OpId1, 19, 80);

DECLARE @OpId2 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (1, 1, DATEADD(day, -8, GETDATE()), 'Completed sales order for EuroFood');
SET @OpId2 = SCOPE_IDENTITY();
INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId2, 3, 50), (@OpId2, 4, 30);

DECLARE @OpId3 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (0, 1, DATEADD(day, -6, GETDATE()), 'Bulk import of frozen salmon from Norway');
SET @OpId3 = SCOPE_IDENTITY();
INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId3, 9, 500);

DECLARE @OpId4 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (1, 0, DATEADD(day, -1, GETDATE()), 'Shipment in progress for Retail Chain Delta');
SET @OpId4 = SCOPE_IDENTITY();
INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId4, 5, 100), (@OpId4, 9, 150);

DECLARE @OpId5 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (2, 0, GETDATE(), 'Internal stock transfer for packaging verification');
SET @OpId5 = SCOPE_IDENTITY();
INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId5, 7, 20);

DECLARE @OpId6 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (0, 0, GETDATE(), 'Expected incoming delivery of fresh vegetables and dairy');
SET @OpId6 = SCOPE_IDENTITY();
INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId6, 1, 400), (@OpId6, 2, 200), (@OpId6, 10, 180);

DECLARE @OpId7 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (1, 2, DATEADD(day, -4, GETDATE()), 'Cancelled sales order for Gourmet House due to unpaid invoice');
SET @OpId7 = SCOPE_IDENTITY();
INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId7, 14, 100);

DECLARE @OpId8 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (3, 1, DATEADD(day, -3, GETDATE()), 'Inter-warehouse move of wheat flour');
SET @OpId8 = SCOPE_IDENTITY();
INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId8, 7, 100);

DECLARE @OpId9 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (1, 0, GETDATE(), 'Pending picking queue task for Local Market Alpha');
SET @OpId9 = SCOPE_IDENTITY();
INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId9, 14, 90), (@OpId9, 15, 10);

DECLARE @OpId10 INT;
INSERT INTO [StockManager].[WarehouseOperations] ([Type], [Status], [Date], [Description])
VALUES (0, 0, DATEADD(day, 2, GETDATE()), 'Scheduled import of frozen fries');
SET @OpId10 = SCOPE_IDENTITY();
INSERT INTO [StockManager].[OperationItems] ([OperationId], [ProductId], [Quantity])
VALUES (@OpId10, 20, 1000);

-- 7. SALES ORDERS
SET IDENTITY_INSERT [StockManager].[SalesOrders] ON;
INSERT INTO [StockManager].[SalesOrders] ([Id], [OrderDate], [ShipDate], [DeliveredDate], [CancelDate], [Status], [CustomerId], [InvoiceId], [ReturnOrderId]) VALUES
(1, GETDATE(), NULL, NULL, NULL, 'Confirmed', 1, 1, NULL),
(2, GETDATE(), NULL, NULL, NULL, 'Draft', 3, 2, NULL),
(3, GETDATE(), NULL, NULL, NULL, 'Confirmed', 5, 3, NULL);
SET IDENTITY_INSERT [StockManager].[SalesOrders] OFF;

-- 8. INVOICES
SET IDENTITY_INSERT [StockManager].[Invoices] ON;
INSERT INTO [StockManager].[Invoices] ([Id], [Type], [InvoiceDate], [DueDate], [Status], [TotalAmount], [PurchaseOrderId], [SalesOrderId]) VALUES
(1, 'Sales', GETDATE(), DATEADD(day, 14, GETDATE()), 'Unpaid', 694.20, NULL, 1),
(2, 'Sales', GETDATE(), DATEADD(day, 14, GETDATE()), 'Unpaid', 1049.50, NULL, 2),
(3, 'Sales', GETDATE(), DATEADD(day, 14, GETDATE()), 'Unpaid', 1317.50, NULL, 3);
SET IDENTITY_INSERT [StockManager].[Invoices] OFF;

-- 9. SALES ORDER LINES
SET IDENTITY_INSERT [StockManager].[SalesOrderLines] ON;
INSERT INTO [StockManager].[SalesOrderLines] ([Id], [Quantity], [UoM], [UnitPrice], [ProductId], [SalesOrderId]) VALUES
(1, 150.00, 'kg', 2.50, 1, 1),
(2, 80.00, 'kg', 3.99, 2, 1),
(3, 300.00, 'pcs', 1.20, 7, 2),
(4, 200.00, 'pcs', 1.50, 8, 2),
(5, 50.00, 'liter', 8.99, 11, 2),
(6, 250.00, 'pcs', 3.49, 14, 3),
(7, 500.00, 'pcs', 0.89, 18, 3);
SET IDENTITY_INSERT [StockManager].[SalesOrderLines] OFF;

-- 10. PURCHASE ORDERS
SET IDENTITY_INSERT [StockManager].[PurchaseOrders] ON;
INSERT INTO [StockManager].[PurchaseOrders] ([Id], [OrderDate], [ExpectedDate], [Status], [SupplierId], [InvoiceId], [ReturnOrderId]) VALUES
(1, GETDATE(), DATEADD(day, 2, GETDATE()), 'Submitted', @Supp1, NULL, NULL),
(2, GETDATE(), DATEADD(day, 5, GETDATE()), 'Draft', @Supp3, NULL, NULL),
(3, GETDATE(), DATEADD(day, 3, GETDATE()), 'Submitted', @Supp5, NULL, NULL);
SET IDENTITY_INSERT [StockManager].[PurchaseOrders] OFF;

-- 11. PURCHASE ORDER LINES
SET IDENTITY_INSERT [StockManager].[PurchaseOrderLines] ON;
INSERT INTO [StockManager].[PurchaseOrderLines] ([Id], [Quantity], [UoM], [UnitPrice], [ProductId], [PurchaseOrderId]) VALUES
(1, 1000.00, 'kg', 1.50, 1, 1),
(2, 500.00, 'kg', 2.50, 2, 1),
(3, 200.00, 'kg', 6.00, 5, 2),
(4, 150.00, 'kg', 4.50, 6, 2),
(5, 300.00, 'kg', 1.80, 16, 3),
(6, 400.00, 'pcs', 0.95, 19, 3);
SET IDENTITY_INSERT [StockManager].[PurchaseOrderLines] OFF;

COMMIT;
PRINT 'Seed successful! Database populated with rich dataset.';
GO
