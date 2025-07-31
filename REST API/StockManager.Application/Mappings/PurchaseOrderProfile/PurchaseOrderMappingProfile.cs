using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;

namespace StockManager.Application.Mappings.PurchaseOrderProfile;

public class PurchaseOrderMappingProfile : Profile
{
    public PurchaseOrderMappingProfile()
    {
        CreateMap<PurchaseOrder, PurchaseOrderDto>().ReverseMap();
        CreateMap<PurchaseOrderCreateDto, PurchaseOrder>()
            .ForMember(dest => dest.InvoiceId, opt => opt.MapFrom(src => src.InvoiceId ?? default))
            .ForMember(dest => dest.ReturnOrderId, opt => opt.MapFrom(src => src.ReturnOrderId ?? default));
        CreateMap<PurchaseOrderUpdateDto, PurchaseOrder>()
            .ForMember(dest => dest.InvoiceId, opt => opt.MapFrom(src => src.InvoiceId ?? default))
            .ForMember(dest => dest.ReturnOrderId, opt => opt.MapFrom(src => src.ReturnOrderId ?? default));
    }
}
