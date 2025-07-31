using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.AddressDtos;

namespace StockManager.Application.Validations.AddressValidation;

public class AddressDeleteValidator : AbstractValidator<AddressDeleteDto>
{
    public AddressDeleteValidator()
    {
        RuleFor(x => x.Id)
            .NotEqual(Guid.Empty).WithMessage("Id is required");
    }
}
