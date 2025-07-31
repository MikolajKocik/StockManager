using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.PermissionDtos;
using StockManager.Core.Domain.Models.PermissionEntity;

namespace StockManager.Application.Mappings.PermissionProfile;

public class PermissionMappingProfile : Profile
{
    public PermissionMappingProfile()
    {
        CreateMap<Permission, PermissionDto>().ReverseMap();
        CreateMap<PermissionCreateDto, Permission>();
        CreateMap<PermissionUpdateDto, Permission>();
    }
}
