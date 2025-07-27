using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.SalesOrder;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.Mappings.SalesOrder;

public class SalesOrderMappingProfile : Profile
{
    public SalesOrderMappingProfile()
    {
        CreateMap<SalesOrder, SalesOrderDto>().ReverseMap();
        CreateMap<SalesOrderCreateDto, SalesOrder>();
        CreateMap<SalesOrderUpdateDto, SalesOrder>();
    }
}
