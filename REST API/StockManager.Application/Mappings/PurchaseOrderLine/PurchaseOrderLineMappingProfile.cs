using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderLine;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Application.Mappings.PurchaseOrderLine;

public class PurchaseOrderLineMappingProfile : Profile
{
    public PurchaseOrderLineMappingProfile()
    {
        CreateMap<PurchaseOrderLine, PurchaseOrderLineDto>().ReverseMap();
        CreateMap<PurchaseOrderLineCreateDto, PurchaseOrderLine>();
        CreateMap<PurchaseOrderLineUpdateDto, PurchaseOrderLine>();
    }
}
