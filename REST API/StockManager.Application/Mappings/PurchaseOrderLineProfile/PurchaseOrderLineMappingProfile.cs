using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Application.Mappings.PurchaseOrderLineProfile;

public class PurchaseOrderLineMappingProfile : Profile
{
    public PurchaseOrderLineMappingProfile()
    {
        CreateMap<PurchaseOrderLine, PurchaseOrderLineDto>().ReverseMap();
        CreateMap<PurchaseOrderLineCreateDto, PurchaseOrderLine>();
        CreateMap<PurchaseOrderLineUpdateDto, PurchaseOrderLine>();
    }
}
