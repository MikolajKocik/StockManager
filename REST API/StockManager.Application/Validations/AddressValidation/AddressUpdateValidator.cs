using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.AddressDtos;

namespace StockManager.Application.Validations.AddressValidation;

public class AddressUpdateValidator : AbstractValidator<AddressUpdateDto>
{
    public AddressUpdateValidator()
    {
        RuleFor(x => x.Id)
            .NotEqual(Guid.Empty).WithMessage("Id is required");
        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(30);
        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Country is required")
            .MaximumLength(30);
        RuleFor(x => x.PostalCode)
            .NotEmpty().WithMessage("PostalCode is required")
            .MaximumLength(50);
        RuleFor(x => x.SupplierId)
            .NotEqual(Guid.Empty).When(x => x.SupplierId.HasValue).WithMessage("SupplierId is required if provided");
        RuleFor(x => x.CustomerId)
            .GreaterThan(0).When(x => x.CustomerId.HasValue).WithMessage("CustomerId must be greater than 0 if provided");
    }
}
