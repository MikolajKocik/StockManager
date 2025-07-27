using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;

namespace StockManager.Application.Validations.PurchaseOrderValidation;

public class PurchaseOrderUpdateValidator : AbstractValidator<PurchaseOrderUpdateDto>
{
    public PurchaseOrderUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.SupplierId)
            .NotEqual(Guid.Empty).When(x => x.SupplierId.HasValue).WithMessage("SupplierId is required if provided");
        RuleFor(x => x.OrderDate)
            .NotEqual(default(DateTime)).When(x => x.OrderDate.HasValue).WithMessage("OrderDate is required if provided");
        RuleFor(x => x.ExpectedDate)
            .GreaterThan(x => x.OrderDate).When(x => x.ExpectedDate.HasValue && x.OrderDate.HasValue).WithMessage("ExpectedDate must be after OrderDate if provided");
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required");
        RuleFor(x => x.InvoiceId)
            .GreaterThan(0).When(x => x.InvoiceId.HasValue).WithMessage("InvoiceId must be greater than 0 if provided");
        RuleFor(x => x.ReturnOrderId)
            .GreaterThan(0).When(x => x.ReturnOrderId.HasValue).WithMessage("ReturnOrderId must be greater than 0 if provided");
    }
}
