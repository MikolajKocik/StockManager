using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.ReturnOrderLine;
using StockManager.Core.Domain.Models.ReturnOrderLineEntity;

namespace StockManager.Application.Mappings.ReturnOrderLine;

public class ReturnOrderLineMappingProfile : Profile
{
    public ReturnOrderLineMappingProfile()
    {
        CreateMap<ReturnOrderLine, ReturnOrderLineDto>().ReverseMap();
        CreateMap<ReturnOrderLineCreateDto, ReturnOrderLine>();
        CreateMap<ReturnOrderLineUpdateDto, ReturnOrderLine>();
    }
}
