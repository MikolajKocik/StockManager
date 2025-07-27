using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.Validations.SupplierValidation;

public class SupplierCreateValidator : AbstractValidator<SupplierCreateDto>
{
    public SupplierCreateValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(50);
        RuleFor(x => x.AddressId)
            .NotEqual(Guid.Empty).WithMessage("AddressId is required");
    }
}
