using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.User;
using StockManager.Core.Domain.Models.UserEntity;

namespace StockManager.Application.Mappings.User;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<User, UserDto>().ReverseMap();
    }
}
