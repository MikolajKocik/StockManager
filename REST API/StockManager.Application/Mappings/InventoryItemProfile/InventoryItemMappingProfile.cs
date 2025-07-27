using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Application.Mappings.InventoryItemProfile;

public class InventoryItemMappingProfile : Profile
{
    public InventoryItemMappingProfile()
    {
        CreateMap<InventoryItem, InventoryItemDto>()
            .ForMember(dest => dest.Warehouse, opt => opt.MapFrom(src => src.Warehouse.ToString()));
        CreateMap<InventoryItemDto, InventoryItem>()
            .ForMember(dest => dest.Warehouse, opt => opt.MapFrom(src => src.Warehouse != null ? Enum.Parse<Warehouse>(src.Warehouse) : default));
        CreateMap<InventoryItemCreateDto, InventoryItem>()
            .ForMember(dest => dest.Warehouse, opt => opt.MapFrom(src => src.Warehouse != null ? Enum.Parse<Warehouse>(src.Warehouse) : default));
        CreateMap<InventoryItemUpdateDto, InventoryItem>()
            .ForMember(dest => dest.Warehouse, opt => opt.MapFrom(src => src.Warehouse != null ? Enum.Parse<Warehouse>(src.Warehouse) : default));
    }
}
