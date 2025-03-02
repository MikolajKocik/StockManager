using FluentValidation;
using StockManager.Core.Domain.Dtos.ModelsDto;

namespace StockManager.Application.Validations
{
    public class AddressValidator : AbstractValidator<AddressDto>
    {
        public AddressValidator() // TODO validation fields on winforms
        {
            RuleFor(c => c.City)
                .NotEmpty()
                .WithMessage("Field 'City' is required")
                .MaximumLength(30)
                .WithMessage("Maximum length of field 'City' is 30 characters");

            RuleFor(ct => ct.Country)
               .NotEmpty()
               .WithMessage("Field 'Country' is required")
               .MaximumLength(30)
               .WithMessage("Maximum length of field 'Country' is 30 characters");

            RuleFor(c => c.PostalCode)
               .NotEmpty()
               .WithMessage("Field 'PostalCode' is required")
               .MaximumLength(30)
               .WithMessage("Maximum length of field 'PostalCode' is 50 characters");
        }
    }
}
