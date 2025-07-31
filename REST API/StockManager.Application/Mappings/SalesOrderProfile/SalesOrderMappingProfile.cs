using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.Mappings.SalesOrderProfile;

public class SalesOrderMappingProfile : Profile
{
    public SalesOrderMappingProfile()
    {
        CreateMap<SalesOrder, SalesOrderDto>().ReverseMap();
        CreateMap<SalesOrderCreateDto, SalesOrder>();
        CreateMap<SalesOrderUpdateDto, SalesOrder>();
    }
}
