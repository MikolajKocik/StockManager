using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.AddressDtos;

namespace StockManager.Application.Validations.AddressValidation;

public class AddressCreateValidator : AbstractValidator<AddressCreateDto>
{
    public AddressCreateValidator()
    {
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
            .NotEqual(Guid.Empty).WithMessage("SupplierId is required");
    }
}
