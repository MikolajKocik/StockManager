using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;

namespace StockManager.Application.Validations.PurchaseOrderValidation;

public class PurchaseOrderCreateValidator : AbstractValidator<PurchaseOrderCreateDto>
{
    public PurchaseOrderCreateValidator()
    {
        RuleFor(x => x.SupplierId)
            .NotEqual(Guid.Empty).WithMessage("SupplierId is required");
        RuleFor(x => x.OrderDate)
            .NotEqual(default(DateTime)).WithMessage("OrderDate is required");
        RuleFor(x => x.ExpectedDate)
            .GreaterThan(x => x.OrderDate).When(x => x.ExpectedDate.HasValue).WithMessage("ExpectedDate must be after OrderDate if provided");
        RuleFor(x => x.InvoiceId)
            .GreaterThan(0).When(x => x.InvoiceId.HasValue).WithMessage("InvoiceId must be greater than 0 if provided");
        RuleFor(x => x.ReturnOrderId)
            .GreaterThan(0).When(x => x.ReturnOrderId.HasValue).WithMessage("ReturnOrderId must be greater than 0 if provided");
    }
}
