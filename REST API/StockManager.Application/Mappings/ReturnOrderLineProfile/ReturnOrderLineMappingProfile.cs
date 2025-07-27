using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.ReturnOrderLineDtos;
using StockManager.Core.Domain.Models.ReturnOrderLineEntity;

namespace StockManager.Application.Mappings.ReturnOrderLineProfile;

public class ReturnOrderLineMappingProfile : Profile
{
    public ReturnOrderLineMappingProfile()
    {
        CreateMap<ReturnOrderLine, ReturnOrderLineDto>().ReverseMap();
        CreateMap<ReturnOrderLineCreateDto, ReturnOrderLine>();
        CreateMap<ReturnOrderLineUpdateDto, ReturnOrderLine>();
    }
}
