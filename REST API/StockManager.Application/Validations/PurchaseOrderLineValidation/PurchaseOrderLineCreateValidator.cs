using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;

namespace StockManager.Application.Validations.PurchaseOrderLineValidation;

public class PurchaseOrderLineCreateValidator : AbstractValidator<PurchaseOrderLineCreateDto>
{
    public PurchaseOrderLineCreateValidator()
    {
        RuleFor(x => x.PurchaseOrderId)
            .GreaterThan(0).WithMessage("PurchaseOrderId must be greater than 0");
        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("ProductId must be greater than 0");
        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0");
        RuleFor(x => x.UoM)
            .NotEmpty().WithMessage("UoM is required");
        RuleFor(x => x.UnitPrice)
            .GreaterThanOrEqualTo(0).WithMessage("UnitPrice must be non-negative");
    }
}
