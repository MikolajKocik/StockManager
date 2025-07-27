using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.Validations.ProductValidation;

public class ProductDtoCollectionValidator : AbstractValidator<ProductDtoCollection>
{
    public ProductDtoCollectionValidator()
    {
        RuleFor(x => x.Data)
            .NotNull().WithMessage("Data collection cannot be null")
            .NotEmpty().WithMessage("Data collection cannot be empty");
    }
}
