using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.ReorderRuleDtos;
using StockManager.Core.Domain.Models.ReorderRuleEntity;

namespace StockManager.Application.Mappings.ReorderRuleProfile;

public class ReorderRuleMappingProfile : Profile
{
    public ReorderRuleMappingProfile()
    {
        CreateMap<ReorderRule, ReorderRuleDto>().ReverseMap();
        CreateMap<ReorderRuleCreateDto, ReorderRule>();
        CreateMap<ReorderRuleUpdateDto, ReorderRule>();
    }
}
