using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.ReorderRule;
using StockManager.Core.Domain.Models.ReorderRuleEntity;

namespace StockManager.Application.Mappings.ReorderRule;

public class ReorderRuleMappingProfile : Profile
{
    public ReorderRuleMappingProfile()
    {
        CreateMap<ReorderRule, ReorderRuleDto>().ReverseMap();
        CreateMap<ReorderRuleCreateDto, ReorderRule>();
        CreateMap<ReorderRuleUpdateDto, ReorderRule>();
    }
}
