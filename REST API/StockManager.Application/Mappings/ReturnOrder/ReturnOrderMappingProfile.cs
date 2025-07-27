using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.ReturnOrder;
using StockManager.Core.Domain.Models.ReturnOrderEntity;

namespace StockManager.Application.Mappings.ReturnOrder;

public class ReturnOrderMappingProfile : Profile
{
    public ReturnOrderMappingProfile()
    {
        CreateMap<ReturnOrder, ReturnOrderDto>().ReverseMap();
        CreateMap<ReturnOrderCreateDto, ReturnOrder>();
        CreateMap<ReturnOrderUpdateDto, ReturnOrder>();
    }
}
