using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.Invoice;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Application.Mappings.Invoice;

public class InvoiceMappingProfile : Profile
{
    public InvoiceMappingProfile()
    {
        CreateMap<Invoice, InvoiceDto>().ReverseMap();
        CreateMap<InvoiceCreateDto, Invoice>()
            .ForMember(dest => dest.PurchaseOrderId, opt => opt.MapFrom(src => src.PurchaseOrderId ?? default))
            .ForMember(dest => dest.SalesOrderId, opt => opt.MapFrom(src => src.SalesOrderId ?? default));
        CreateMap<InvoiceUpdateDto, Invoice>()
            .ForMember(dest => dest.PurchaseOrderId, opt => opt.MapFrom(src => src.PurchaseOrderId ?? default))
            .ForMember(dest => dest.SalesOrderId, opt => opt.MapFrom(src => src.SalesOrderId ?? default));
    }
}
