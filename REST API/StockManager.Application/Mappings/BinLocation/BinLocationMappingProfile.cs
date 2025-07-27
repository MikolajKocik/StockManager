using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.BinLocation;
using StockManager.Core.Domain.Models.BinLocationEntity;

namespace StockManager.Application.Mappings.BinLocation;

public class BinLocationMappingProfile : Profile
{
    public BinLocationMappingProfile()
    {
        CreateMap<BinLocation, BinLocationDto>().ReverseMap();
        CreateMap<BinLocationCreateDto, BinLocation>();
        CreateMap<BinLocationUpdateDto, BinLocation>()
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Code ?? string.Empty))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description ?? string.Empty))
            .ForMember(dest => dest.Warehouse, opt => opt.MapFrom(src => src.Warehouse ?? string.Empty));
    }
}
