using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.UserDtos;
using StockManager.Core.Domain.Models.UserEntity;

namespace StockManager.Application.Mappings.UserProfile;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<User, UserDto>().ReverseMap();
    }
}
