using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.Role;
using StockManager.Core.Domain.Models.RoleEntity;

namespace StockManager.Application.Mappings.Role;

public class RoleMappingProfile : Profile
{
    public RoleMappingProfile()
    {
        CreateMap<Role, RoleDto>().ReverseMap();
        CreateMap<RoleCreateDto, Role>();
        CreateMap<RoleUpdateDto, Role>();
    }
}
