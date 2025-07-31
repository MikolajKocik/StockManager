using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.SalesOrderLineDtos;
using StockManager.Core.Domain.Models.SalesOrderLineEntity;

namespace StockManager.Application.Mappings.SalesOrderLineProfile;

public class SalesOrderLineMappingProfile : Profile
{
    public SalesOrderLineMappingProfile()
    {
        CreateMap<SalesOrderLine, SalesOrderLineDto>().ReverseMap();
        CreateMap<SalesOrderLineCreateDto, SalesOrderLine>();
        CreateMap<SalesOrderLineUpdateDto, SalesOrderLine>();
    }
}
