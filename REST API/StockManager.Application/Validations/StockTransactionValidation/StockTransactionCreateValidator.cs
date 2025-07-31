using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;

namespace StockManager.Application.Validations.StockTransactionValidation;

public class StockTransactionCreateValidator : AbstractValidator<StockTransactionCreateDto>
{
    public StockTransactionCreateValidator()
    {
        RuleFor(x => x.InventoryItemId)
            .GreaterThan(0).WithMessage("InventoryItemId must be greater than 0");
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required");
        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0");
        RuleFor(x => x.Date)
            .NotEqual(default(DateTime)).WithMessage("Date is required");
        RuleFor(x => x.ReferenceNumber)
            .NotEmpty().WithMessage("ReferenceNumber is required")
            .MaximumLength(50);
        RuleFor(x => x.SourceLocationId)
            .GreaterThan(0).When(x => x.SourceLocationId.HasValue).WithMessage("SourceLocationId must be greater than 0 if provided");
        RuleFor(x => x.TargetLocationId)
            .GreaterThan(0).When(x => x.TargetLocationId.HasValue).WithMessage("TargetLocationId must be greater than 0 if provided");
    }
}
