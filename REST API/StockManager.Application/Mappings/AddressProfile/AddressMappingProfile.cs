using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.AddressDtos;
using StockManager.Core.Domain.Models.AddressEntity;

namespace StockManager.Application.Mappings.AddressProfile;

public class AddressMappingProfile : Profile
{
    public AddressMappingProfile()
    {
        CreateMap<Address, AddressDto>()
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId));
        CreateMap<AddressDto, Address>()
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId));
        CreateMap<AddressCreateDto, Address>()
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId));
        CreateMap<AddressUpdateDto, Address>()
            .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId ?? default))
            .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId ?? default))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City ?? string.Empty))
            .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country ?? string.Empty))
            .ForMember(dest => dest.PostalCode, opt => opt.MapFrom(src => src.PostalCode ?? string.Empty));
    }
}
