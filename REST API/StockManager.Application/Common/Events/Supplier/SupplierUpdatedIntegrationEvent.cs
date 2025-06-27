using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Application.Dtos.ModelsDto.Address;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.Common.Events.Supplier;

public sealed record SupplierUpdatedIntegrationEvent(
    Guid SupplierId,
    string Name,
    AddressDto? Address,
    Guid? AddressId,
    List<ProductDto>? Products
    ) : IIntegrationEvent;
