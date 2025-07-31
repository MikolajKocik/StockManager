using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;

namespace StockManager.Application.Validations.PurchaseOrderLineValidation;

public class PurchaseOrderLineUpdateValidator : AbstractValidator<PurchaseOrderLineUpdateDto>
{
    public PurchaseOrderLineUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.Quantity)
            .GreaterThan(0).When(x => x.Quantity.HasValue).WithMessage("Quantity must be greater than 0 if provided");
        RuleFor(x => x.UoM)
            .NotEmpty().WithMessage("UoM is required");
        RuleFor(x => x.UnitPrice)
            .GreaterThanOrEqualTo(0).When(x => x.UnitPrice.HasValue).WithMessage("UnitPrice must be non-negative if provided");
    }
}
