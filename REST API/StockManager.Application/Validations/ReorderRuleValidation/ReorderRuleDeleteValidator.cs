using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ReorderRuleDtos;

namespace StockManager.Application.Validations.ReorderRuleValidation;

public class ReorderRuleDeleteValidator : AbstractValidator<ReorderRuleDeleteDto>
{
    public ReorderRuleDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
    }
}
