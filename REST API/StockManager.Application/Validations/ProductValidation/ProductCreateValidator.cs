using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.Validations.ProductValidation;

public class ProductCreateValidator : AbstractValidator<ProductCreateDto>
{
    public ProductCreateValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100);
        RuleFor(x => x.Genre)
            .NotEmpty().WithMessage("Genre is required")
            .MaximumLength(50);
        RuleFor(x => x.Unit)
            .NotEmpty().WithMessage("Unit is required")
            .MaximumLength(20);
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required")
            .MaximumLength(50);
        RuleFor(x => x.BatchNumber)
            .NotEmpty().WithMessage("BatchNumber is required")
            .MaximumLength(50);
        RuleFor(x => x.SupplierId)
            .NotEqual(Guid.Empty).WithMessage("SupplierId is required");
        RuleFor(x => x.ExpirationDate)
            .GreaterThan(DateTime.MinValue).WithMessage("ExpirationDate is required");
    }
}
