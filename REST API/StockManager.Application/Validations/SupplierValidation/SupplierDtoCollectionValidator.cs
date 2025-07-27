using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.Validations.SupplierValidation;

public class SupplierDtoCollectionValidator : AbstractValidator<SupplierDtoCollection>
{
    public SupplierDtoCollectionValidator()
    {
        RuleFor(x => x.Data)
            .NotNull().WithMessage("Data collection cannot be null")
            .NotEmpty().WithMessage("Data collection cannot be empty");
    }
}
