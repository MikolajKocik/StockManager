using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;
using StockManager.Core.Domain.Models.CustomerEntity;

namespace StockManager.Application.Mappings.CustomerProfile;

public class CustomerMappingProfile : Profile
{
    public CustomerMappingProfile()
    {
        CreateMap<Customer, CustomerDto>().ReverseMap();
        CreateMap<CustomerCreateDto, Customer>()
            .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.AddressId));
        CreateMap<CustomerUpdateDto, Customer>()
            .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.AddressId ?? default));
    }
}
