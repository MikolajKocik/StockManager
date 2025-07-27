using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ReturnOrderDtos;

namespace StockManager.Application.Validations.ReturnOrderValidation;

public class ReturnOrderCreateValidator : AbstractValidator<ReturnOrderCreateDto>
{
    public ReturnOrderCreateValidator()
    {
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required");
        RuleFor(x => x.ReturnDate)
            .NotEqual(default(DateTime)).WithMessage("ReturnDate is required");
        RuleFor(x => x.PurchaseOrderId)
            .GreaterThan(0).When(x => x.PurchaseOrderId.HasValue).WithMessage("PurchaseOrderId must be greater than 0 if provided");
        RuleFor(x => x.SalesOrderId)
            .GreaterThan(0).When(x => x.SalesOrderId.HasValue).WithMessage("SalesOrderId must be greater than 0 if provided");
    }
}
