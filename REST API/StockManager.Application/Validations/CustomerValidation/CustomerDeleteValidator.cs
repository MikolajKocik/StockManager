using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;

namespace StockManager.Application.Validations.CustomerValidation;

public class CustomerDeleteValidator : AbstractValidator<CustomerDeleteDto>
{
    public CustomerDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
    }
}
