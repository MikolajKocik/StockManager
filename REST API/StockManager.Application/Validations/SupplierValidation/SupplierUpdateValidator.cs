using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.Validations.SupplierValidation;

public class SupplierUpdateValidator : AbstractValidator<SupplierUpdateDto>
{
    public SupplierUpdateValidator()
    {
        RuleFor(x => x.Id)
            .NotEqual(Guid.Empty).WithMessage("Id is required");
        RuleFor(x => x.Name)
            .MaximumLength(50);
        RuleFor(x => x.AddressId)
            .NotEqual(Guid.Empty).When(x => x.AddressId.HasValue).WithMessage("AddressId is required if provided");
    }
}
