using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ReturnOrderLineDtos;

namespace StockManager.Application.Validations.ReturnOrderLineValidation;

public class ReturnOrderLineDeleteValidator : AbstractValidator<ReturnOrderLineDeleteDto>
{
    public ReturnOrderLineDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
    }
}
