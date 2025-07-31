using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.AuditLogDtos;
using StockManager.Core.Domain.Models.AuditLogEntity;

namespace StockManager.Application.Mappings.AuditLogProfile;

public class AuditLogMappingProfile : Profile
{
    public AuditLogMappingProfile()
    {
        CreateMap<AuditLog, AuditLogDto>().ReverseMap();
        CreateMap<AuditLogCreateDto, AuditLog>()
            .ForMember(dest => dest.ChangedById, opt => opt.MapFrom(src => src.ChangedById ?? string.Empty));
    }
}
