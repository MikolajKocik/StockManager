using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.Validations.ProductValidation;

public class ProductDeleteValidator : AbstractValidator<ProductDeleteDto>
{
    public ProductDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id is required and must be greater than 0");
    }
}
