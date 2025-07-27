using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ReturnOrderDtos;

namespace StockManager.Application.Validations.ReturnOrderValidation;

public class ReturnOrderDeleteValidator : AbstractValidator<ReturnOrderDeleteDto>
{
    public ReturnOrderDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
    }
}
