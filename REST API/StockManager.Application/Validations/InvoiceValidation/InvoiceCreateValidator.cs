using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.InvoiceDtos;

namespace StockManager.Application.Validations.InvoiceValidation;

public class InvoiceCreateValidator : AbstractValidator<InvoiceCreateDto>
{
    public InvoiceCreateValidator()
    {
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required")
            .MaximumLength(30);
        RuleFor(x => x.InvoiceDate)
            .NotEqual(default(DateTime)).WithMessage("InvoiceDate is required");
        RuleFor(x => x.TotalAmount)
            .GreaterThanOrEqualTo(0).WithMessage("TotalAmount must be non-negative");
        RuleFor(x => x.DueDate)
            .GreaterThan(x => x.InvoiceDate).When(x => x.DueDate.HasValue).WithMessage("DueDate must be after InvoiceDate if provided");
        RuleFor(x => x.PurchaseOrderId)
            .GreaterThan(0).When(x => x.PurchaseOrderId.HasValue).WithMessage("PurchaseOrderId must be greater than 0 if provided");
        RuleFor(x => x.SalesOrderId)
            .GreaterThan(0).When(x => x.SalesOrderId.HasValue).WithMessage("SalesOrderId must be greater than 0 if provided");
    }
}
