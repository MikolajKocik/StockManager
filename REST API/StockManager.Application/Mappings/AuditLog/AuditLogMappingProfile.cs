using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.AuditLog;
using StockManager.Core.Domain.Models.AuditLogEntity;

namespace StockManager.Application.Mappings.AuditLog;

public class AuditLogMappingProfile : Profile
{
    public AuditLogMappingProfile()
    {
        CreateMap<AuditLog, AuditLogDto>().ReverseMap();
        CreateMap<AuditLogCreateDto, AuditLog>()
            .ForMember(dest => dest.ChangedById, opt => opt.MapFrom(src => src.ChangedById ?? string.Empty));
    }
}
