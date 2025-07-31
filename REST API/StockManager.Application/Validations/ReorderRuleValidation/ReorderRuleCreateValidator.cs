using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ReorderRuleDtos;

namespace StockManager.Application.Validations.ReorderRuleValidation;

public class ReorderRuleCreateValidator : AbstractValidator<ReorderRuleCreateDto>
{
    public ReorderRuleCreateValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("ProductId must be greater than 0");
        RuleFor(x => x.Warehouse)
            .NotEmpty().WithMessage("Warehouse is required");
        RuleFor(x => x.MinLevel)
            .GreaterThanOrEqualTo(0).WithMessage("MinLevel must be non-negative");
        RuleFor(x => x.MaxLevel)
            .GreaterThanOrEqualTo(x => x.MinLevel).WithMessage("MaxLevel must be greater than or equal to MinLevel");
    }
}
