using AutoMapper;
using StockManager.Application.Dtos;
using StockManager.Models;

namespace StockManager.Application.Mappings
{
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
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
                .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src.Supplier));

            CreateMap<ProductDto, Product>()
                .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => 
                    Enum.IsDefined(typeof(Genre), src.Genre) ? (Genre)Enum.Parse(typeof(Genre), src.Genre) : default))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => 
                    Enum.IsDefined(typeof(Warehouse), src.Type) ? (Warehouse)Enum.Parse(typeof(Warehouse), src.Type) : default))
                .ForMember(dest => dest.Supplier, opt => opt.Condition(src => src.Supplier != null))
                .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src.Supplier!))
                .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId ?? Guid.Empty));
        }
    }
}