using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.Validations.ProductValidation;

public class ProductUpdateValidator : AbstractValidator<ProductUpdateDto>
{
    public ProductUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.Name)
            .MaximumLength(100);
        RuleFor(x => x.Genre)
            .NotEmpty().WithMessage("Genre is required");
        RuleFor(x => x.Unit)
            .MaximumLength(20);
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required");
        RuleFor(x => x.BatchNumber)
            .MaximumLength(50);
        RuleFor(x => x.SupplierId)
            .NotEqual(Guid.Empty).When(x => x.SupplierId.HasValue).WithMessage("SupplierId is required if provided");
        RuleFor(x => x.ExpirationDate)
            .GreaterThan(DateTime.MinValue).When(x => x.ExpirationDate.HasValue).WithMessage("ExpirationDate is required if provided");
    }
}
