using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;

namespace StockManager.Application.Validations.StockTransactionValidation;

public class StockTransactionUpdateValidator : AbstractValidator<StockTransactionUpdateDto>
{
    public StockTransactionUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.Type)
            .NotEmpty().When(x => x.Type != null).WithMessage("Type is required if provided");
        RuleFor(x => x.Quantity)
            .GreaterThan(0).When(x => x.Quantity.HasValue).WithMessage("Quantity must be greater than 0 if provided");
        RuleFor(x => x.Date)
            .NotEqual(default(DateTime)).When(x => x.Date.HasValue).WithMessage("Date must be a valid date if provided");
        RuleFor(x => x.ReferenceNumber)
            .MaximumLength(50);
        RuleFor(x => x.SourceLocationId)
            .GreaterThan(0).When(x => x.SourceLocationId.HasValue).WithMessage("SourceLocationId must be greater than 0 if provided");
        RuleFor(x => x.TargetLocationId)
            .GreaterThan(0).When(x => x.TargetLocationId.HasValue).WithMessage("TargetLocationId must be greater than 0 if provided");
    }
}
