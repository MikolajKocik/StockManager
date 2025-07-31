using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Application.Mappings.ShipmentProfile;

public class ShipmentMappingProfile : Profile
{
    public ShipmentMappingProfile()
    {
        CreateMap<Shipment, ShipmentDto>().ReverseMap();
        CreateMap<ShipmentCreateDto, Shipment>();
        CreateMap<ShipmentUpdateDto, Shipment>();
    }
}
