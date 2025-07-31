using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ReorderRuleDtos;

namespace StockManager.Application.Validations.ReorderRuleValidation;

public class ReorderRuleUpdateValidator : AbstractValidator<ReorderRuleUpdateDto>
{
    public ReorderRuleUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.ProductId)
            .GreaterThan(0).When(x => x.ProductId.HasValue).WithMessage("ProductId must be greater than 0 if provided");
        RuleFor(x => x.Warehouse);
        RuleFor(x => x.MinLevel)
            .GreaterThanOrEqualTo(0).When(x => x.MinLevel.HasValue).WithMessage("MinLevel must be non-negative if provided");
        RuleFor(x => x.MaxLevel)
            .GreaterThanOrEqualTo(x => x.MinLevel ?? 0).When(x => x.MaxLevel.HasValue && x.MinLevel.HasValue).WithMessage("MaxLevel must be greater than or equal to MinLevel if provided");
    }
}
