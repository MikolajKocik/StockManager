using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.Mappings.ShipmentProfile;

public class ShipmentMappingProfile : Profile
{
    public ShipmentMappingProfile()
    {
        CreateMap<Shipment, ShipmentDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.SalesOrder.Customer.Name))
            .ForMember(dest => dest.DestinationCity, opt => opt.MapFrom(src => src.SalesOrder.Customer.Address.City))
            .ForMember(dest => dest.DestinationCountry, opt => opt.MapFrom(src => src.SalesOrder.Customer.Address.Country))
            .ForMember(dest => dest.OriginCity, opt => opt.MapFrom(src => src.SalesOrder.SalesOrderLines.Count > 0 ? src.SalesOrder.SalesOrderLines[0].Product.Supplier.Address.City : null))
            .ForMember(dest => dest.OriginCountry, opt => opt.MapFrom(src => src.SalesOrder.SalesOrderLines.Count > 0 ? src.SalesOrder.SalesOrderLines[0].Product.Supplier.Address.Country : null))
            .ReverseMap();
            
        CreateMap<ShipmentCreateDto, Shipment>();
        CreateMap<ShipmentUpdateDto, Shipment>();
    }
}
