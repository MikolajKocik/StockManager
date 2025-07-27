using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.Permission;
using StockManager.Core.Domain.Models.PermissionEntity;

namespace StockManager.Application.Mappings.Permission;

public class PermissionMappingProfile : Profile
{
    public PermissionMappingProfile()
    {
        CreateMap<Permission, PermissionDto>().ReverseMap();
        CreateMap<PermissionCreateDto, Permission>();
        CreateMap<PermissionUpdateDto, Permission>();
    }
}
