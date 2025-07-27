using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ReturnOrderDtos;

namespace StockManager.Application.Validations.ReturnOrderValidation;

public class ReturnOrderUpdateValidator : AbstractValidator<ReturnOrderUpdateDto>
{
    public ReturnOrderUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.Type)
            .NotEmpty().When(x => x.Type != null).WithMessage("Type is required if provided");
        RuleFor(x => x.Status)
            .NotEmpty().When(x => x.Status != null).WithMessage("Status is required if provided");
        RuleFor(x => x.ReturnDate)
            .NotEqual(default(DateTime)).When(x => x.ReturnDate.HasValue).WithMessage("ReturnDate is required if provided");
        RuleFor(x => x.PurchaseOrderId)
            .GreaterThan(0).When(x => x.PurchaseOrderId.HasValue).WithMessage("PurchaseOrderId must be greater than 0 if provided");
        RuleFor(x => x.SalesOrderId)
            .GreaterThan(0).When(x => x.SalesOrderId.HasValue).WithMessage("SalesOrderId must be greater than 0 if provided");
    }
}
