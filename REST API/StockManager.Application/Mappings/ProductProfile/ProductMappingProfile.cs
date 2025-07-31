using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.Mappings.ProductProfile;

public class ProductMappingProfile : Profile
{
    public ProductMappingProfile()
    {
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => src.Genre))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.Name : default));

        CreateMap<ProductDto, Product>()
           .ConstructUsing(src => new Product(
               src.Id,
               src.Name,
               Enum.IsDefined(typeof(Genre), src.Genre) ? (Genre)Enum.Parse(typeof(Genre), src.Genre) : default,
               src.Unit,
               Enum.IsDefined(typeof(Warehouse), src.Type) ? (Warehouse)Enum.Parse(typeof(Warehouse), src.Type) : default,
               src.BatchNumber,
               src.SupplierId,
               src.ExpirationDate,
               src.IsDeleted
            ))
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId))
            .ForMember(dest => dest.Supplier, opt => opt.Ignore())
            .ForMember(dest => dest.InventoryItems, opt => opt.Ignore())
            .ForMember(dest => dest.PurchaseOrderLines, opt => opt.Ignore())
            .ForMember(dest => dest.SalesOrderLines, opt => opt.Ignore())
            .ForMember(dest => dest.ReturnOrderLines, opt => opt.Ignore())
            .ForMember(dest => dest.ReorderRules, opt => opt.Ignore())
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.DeliveredAt, opt => opt.Ignore());

        CreateMap<ProductCreateDto, Product>()
            .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => Enum.IsDefined(typeof(Genre), src.Genre) ? (Genre)Enum.Parse(typeof(Genre), src.Genre) : default))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.IsDefined(typeof(Warehouse), src.Type) ? (Warehouse)Enum.Parse(typeof(Warehouse), src.Type) : default))
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId))
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.DeliveredAt, opt => opt.Ignore())
            .ForMember(dest => dest.Supplier, opt => opt.Ignore())
            .ForMember(dest => dest.InventoryItems, opt => opt.Ignore())
            .ForMember(dest => dest.PurchaseOrderLines, opt => opt.Ignore())
            .ForMember(dest => dest.SalesOrderLines, opt => opt.Ignore())
            .ForMember(dest => dest.ReturnOrderLines, opt => opt.Ignore())
            .ForMember(dest => dest.ReorderRules, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<ProductUpdateDto, Product>()
            .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => src.Genre != null && Enum.IsDefined(typeof(Genre), src.Genre) ? (Genre)Enum.Parse(typeof(Genre), src.Genre) : default))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type != null && Enum.IsDefined(typeof(Warehouse), src.Type) ? (Warehouse)Enum.Parse(typeof(Warehouse), src.Type) : default))
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId ?? Guid.Empty))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name ?? string.Empty))
            .ForMember(dest => dest.BatchNumber, opt => opt.MapFrom(src => src.BatchNumber ?? string.Empty))
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.DeliveredAt, opt => opt.Ignore())
            .ForMember(dest => dest.Supplier, opt => opt.Ignore())
            .ForMember(dest => dest.InventoryItems, opt => opt.Ignore())
            .ForMember(dest => dest.PurchaseOrderLines, opt => opt.Ignore())
            .ForMember(dest => dest.SalesOrderLines, opt => opt.Ignore())
            .ForMember(dest => dest.ReturnOrderLines, opt => opt.Ignore())
            .ForMember(dest => dest.ReorderRules, opt => opt.Ignore());

        CreateMap<ProductCreateDto, ProductDto>()
            .ConstructUsing(src => new ProductDto
            {
                Name = src.Name,
                Genre = src.Genre,
                Unit = src.Unit,
                Type = src.Type,
                BatchNumber = src.BatchNumber,
                SupplierId = src.SupplierId,
                ExpirationDate = src.ExpirationDate
            })
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.DeliveredAt, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.SupplierName, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());

        CreateMap<ProductDto, ProductCreateDto>()
            .ConstructUsing(src => new ProductCreateDto
            {
                Name = src.Name,
                Genre = src.Genre,
                Unit = src.Unit,
                Type = src.Type,
                BatchNumber = src.BatchNumber,
                SupplierId = src.SupplierId,
                ExpirationDate = src.ExpirationDate
            });
    }
}
