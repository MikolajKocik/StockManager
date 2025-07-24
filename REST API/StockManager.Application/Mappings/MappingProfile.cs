using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.Address;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Core.Application.Dtos.Authorization;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.AddressEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SupplierEntity;
using StockManager.Core.Domain.Models.UserEntity;

namespace StockManager.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Address
        CreateMap<Address, AddressDto>()
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId));

        CreateMap<AddressDto, Address>()
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId));

        // Supplier
        CreateMap<Supplier, SupplierDto>()
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address));

        CreateMap<SupplierDto, Supplier>()
            .ForMember(dest => dest.Address, opt => opt.Condition(src => src.Address != null))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address!));

        // Product
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => src.Genre.ToString()))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));

        CreateMap<ProductDto, Product>()
            .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => 
                Enum.IsDefined(typeof(Genre), src.Genre) ? (Genre)Enum.Parse(typeof(Genre), src.Genre) : default))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => 
                Enum.IsDefined(typeof(Warehouse), src.Type) ? (Warehouse)Enum.Parse(typeof(Warehouse), src.Type) : default))
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId ?? Guid.Empty));

        CreateMap<RegisterDto, User>().ReverseMap();

        CreateMap<LoginDto, User>().ReverseMap();

        CreateMap<LoginResultDto, User>().ReverseMap();
    }
}
