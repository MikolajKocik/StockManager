using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Application.Mappings.WarehouseOperationProfile;

public class WarehouseOperationProfile : Profile
{
    public WarehouseOperationProfile()
    {
        CreateMap<WarehouseOperation, WarehouseOperationDto>();
        CreateMap<OperationItem, OperationItemDto>();
        CreateMap<Document, DocumentDto>();
    }
}
