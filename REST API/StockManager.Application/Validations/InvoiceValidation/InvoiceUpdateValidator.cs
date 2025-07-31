using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.InvoiceDtos;

namespace StockManager.Application.Validations.InvoiceValidation;

public class InvoiceUpdateValidator : AbstractValidator<InvoiceUpdateDto>
{
    public InvoiceUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.Type)
            .MaximumLength(30);
        RuleFor(x => x.TotalAmount)
            .GreaterThanOrEqualTo(0).When(x => x.TotalAmount.HasValue).WithMessage("TotalAmount must be non-negative if provided");
        RuleFor(x => x.DueDate)
            .GreaterThan(x => x.InvoiceDate).When(x => x.DueDate.HasValue && x.InvoiceDate.HasValue).WithMessage("DueDate must be after InvoiceDate if provided");
        RuleFor(x => x.PurchaseOrderId)
            .GreaterThan(0).When(x => x.PurchaseOrderId.HasValue).WithMessage("PurchaseOrderId must be greater than 0 if provided");
        RuleFor(x => x.SalesOrderId)
            .GreaterThan(0).When(x => x.SalesOrderId.HasValue).WithMessage("SalesOrderId must be greater than 0 if provided");
        RuleFor(x => x.Status)
            .MaximumLength(30);
    }
}
