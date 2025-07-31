using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;

namespace StockManager.Application.Validations.PurchaseOrderValidation;

public class PurchaseOrderDeleteValidator : AbstractValidator<PurchaseOrderDeleteDto>
{
    public PurchaseOrderDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
    }
}
