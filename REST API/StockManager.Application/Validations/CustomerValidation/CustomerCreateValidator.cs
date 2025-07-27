using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;

namespace StockManager.Application.Validations.CustomerValidation;

public class CustomerCreateValidator : AbstractValidator<CustomerCreateDto>
{
    public CustomerCreateValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(50);
        RuleFor(x => x.TaxId)
            .NotEmpty().WithMessage("TaxId is required")
            .MaximumLength(20);
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(100);
        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .MaximumLength(20);
        RuleFor(x => x.AddressId)
            .NotEqual(Guid.Empty).WithMessage("AddressId is required");
    }
}
