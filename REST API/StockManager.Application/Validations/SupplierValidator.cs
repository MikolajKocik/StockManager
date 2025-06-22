using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.Supplier;

namespace StockManager.Application.Validations;

public class SupplierValidator : AbstractValidator<SupplierDto>
{
    public SupplierValidator() 
    {
        RuleFor(n => n.Name)
            .NotEmpty()
            .WithMessage("Field 'Name' is required")
            .MaximumLength(50)
            .WithMessage("Maximum length of field 'Name' is 50 characters");

        RuleFor(a => a.Address!)
            .SetValidator(new AddressValidator())
            .When(a => a.Address != null);
    }
}
