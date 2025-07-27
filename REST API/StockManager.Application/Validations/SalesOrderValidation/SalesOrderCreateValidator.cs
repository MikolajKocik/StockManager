using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;

namespace StockManager.Application.Validations.SalesOrderValidation;

public class SalesOrderCreateValidator : AbstractValidator<SalesOrderCreateDto>
{
    public SalesOrderCreateValidator()
    {
        RuleFor(x => x.CustomerId)
            .GreaterThan(0).WithMessage("CustomerId must be greater than 0");
        RuleFor(x => x.OrderDate)
            .NotEqual(default(DateTime)).WithMessage("OrderDate is required");
        RuleFor(x => x.InvoiceId)
            .GreaterThan(0).WithMessage("InvoiceId must be greater than 0");
        RuleFor(x => x.ReturnOrderId)
            .GreaterThan(0)
            .When(x => x.ReturnOrderId.HasValue)
            .WithMessage("ReturnOrderId must be greater than 0 if provided");
        RuleFor(x => x.ShipDate)
            .NotEqual(default(DateTime))
            .When(x => x.ShipDate.HasValue)
            .WithMessage("ShipDate must be a valid date if provided");
        RuleFor(x => x.DeliveredDate)
            .NotEqual(default(DateTime))
            .When(x => x.DeliveredDate.HasValue)
            .WithMessage("DeliveredDate must be a valid date if provided");
        RuleFor(x => x.CancelDate)
            .NotEqual(default(DateTime))
            .When(x => x.CancelDate.HasValue)
            .WithMessage("CancelDate must be a valid date if provided");
    }
}
