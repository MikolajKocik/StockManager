using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;

namespace StockManager.Application.Validations.PurchaseOrderLineValidation;

public class PurchaseOrderLineDeleteValidator : AbstractValidator<PurchaseOrderLineDeleteDto>
{
    public PurchaseOrderLineDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
    }
}
