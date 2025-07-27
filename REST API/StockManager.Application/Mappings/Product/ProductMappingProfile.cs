using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.Mappings.Product;

public class ProductMappingProfile : Profile
{
    public ProductMappingProfile()
    {
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => src.Genre.ToString()))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));
        CreateMap<ProductDto, Product>()
            .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => 
                Enum.IsDefined(typeof(Genre), src.Genre) ? (Genre)Enum.Parse(typeof(Genre), src.Genre) : default))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => 
                Enum.IsDefined(typeof(Warehouse), src.Type) ? (Warehouse)Enum.Parse(typeof(Warehouse), src.Type) : default))
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId ?? Guid.Empty));
        CreateMap<ProductCreateDto, Product>()
            .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => Enum.IsDefined(typeof(Genre), src.Genre) ? (Genre)Enum.Parse(typeof(Genre), src.Genre) : default))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.IsDefined(typeof(Warehouse), src.Type) ? (Warehouse)Enum.Parse(typeof(Warehouse), src.Type) : default))
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId));
        CreateMap<ProductUpdateDto, Product>()
            .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => src.Genre != null && Enum.IsDefined(typeof(Genre), src.Genre) ? (Genre)Enum.Parse(typeof(Genre), src.Genre) : default))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type != null && Enum.IsDefined(typeof(Warehouse), src.Type) ? (Warehouse)Enum.Parse(typeof(Warehouse), src.Type) : default))
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId ?? Guid.Empty))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name ?? string.Empty))
            .ForMember(dest => dest.BatchNumber, opt => opt.MapFrom(src => src.BatchNumber ?? string.Empty));
    }
}
