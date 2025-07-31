using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ReturnOrderLineDtos;

namespace StockManager.Application.Validations.ReturnOrderLineValidation;

public class ReturnOrderLineUpdateValidator : AbstractValidator<ReturnOrderLineUpdateDto>
{
    public ReturnOrderLineUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.Quantity)
            .GreaterThan(0).When(x => x.Quantity.HasValue).WithMessage("Quantity must be greater than 0 if provided");
        RuleFor(x => x.UoM);
    }
}
