using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.Mappings.SupplierProfile;

public class SupplierMappingProfile : Profile
{
    public SupplierMappingProfile()
    {
        CreateMap<Supplier, SupplierDto>()
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address));
        CreateMap<SupplierDto, Supplier>()
            .ForMember(dest => dest.Address, opt => opt.Condition(src => src.Address != null))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address!));
        CreateMap<SupplierCreateDto, Supplier>()
            .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.AddressId));
        CreateMap<SupplierUpdateDto, Supplier>()
            .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.AddressId ?? default))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name ?? string.Empty));
    }
}
