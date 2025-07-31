using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;

namespace SStockManager.Application.Validations.CustomerValidation;

public class CustomerUpdateValidator : AbstractValidator<CustomerUpdateDto>
{
    public CustomerUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.Name)
            .MaximumLength(50);
        RuleFor(x => x.TaxId)
            .MaximumLength(20);
        RuleFor(x => x.Email)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email))
            .MaximumLength(100);
        RuleFor(x => x.Phone)
            .MaximumLength(20);
        RuleFor(x => x.AddressId)
            .NotEqual(Guid.Empty).When(x => x.AddressId.HasValue).WithMessage("AddressId is required if provided");
    }
}
