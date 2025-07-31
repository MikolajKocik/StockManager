using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.ReturnOrderDtos;
using StockManager.Core.Domain.Models.ReturnOrderEntity;

namespace StockManager.Application.Mappings.ReturnOrderProfile;

public class ReturnOrderMappingProfile : Profile
{
    public ReturnOrderMappingProfile()
    {
        CreateMap<ReturnOrder, ReturnOrderDto>().ReverseMap();
        CreateMap<ReturnOrderCreateDto, ReturnOrder>();
        CreateMap<ReturnOrderUpdateDto, ReturnOrder>();
    }
}
