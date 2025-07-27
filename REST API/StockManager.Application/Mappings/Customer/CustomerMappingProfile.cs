using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.Customer;
using StockManager.Core.Domain.Models.CustomerEntity;

namespace StockManager.Application.Mappings.Customer;

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
