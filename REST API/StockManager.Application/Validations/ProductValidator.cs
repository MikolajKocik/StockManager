using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.Validations;

public class ProductValidator : AbstractValidator<ProductDto>
{
    public ProductValidator() 
    {
        RuleFor(n => n.Name)
            .NotEmpty()
            .WithMessage("Field 'Name' is required")
            .MaximumLength(50)
            .WithMessage("Maximum length of field 'Name' is 50 characters");

        RuleFor(g => g.Genre)
            .NotEmpty()
            .WithMessage("Field 'Genre' is required.");

        RuleFor(u => u.Unit)
            .MaximumLength(15)
            .When(u => u.Unit != null)
            .Must(u => AllowedUnits(u)).WithMessage("Bad unit, allowed units: kg, deg, pcs, l, ml")
            .WithMessage("Field 'Unit' has maximum length of 15 characters.");

        RuleFor(ed => ed.ExpirationDate)
            .Must(IsValidExpirationDate())
            .WithMessage("Field 'EXpirationDate' must be in the future");

        RuleFor(ed => ed.ExpirationDate)
          .Must(ed => ed.Date != default)
          .WithMessage("Field 'Expiration Date' is required.");

        RuleFor(t => t.Type)
            .NotEmpty()
            .WithMessage("Field 'Section' is required.");

        RuleFor(bn => bn.BatchNumber)
            .NotEmpty()
            .WithMessage("Field 'BatchNumber' is required")
            .MaximumLength(200)
            .WithMessage("Maximum length of field 'BatchNumber' is 200 characters.");
    }

    private static bool AllowedUnits(string unit)
    {
        string[] units = ["kg", "deg", "pcs", "l", "ml"];

        return units.Contains(unit);
    }

    private static Func<ProductDto, DateTime, bool> IsValidExpirationDate()
    {
        Func<ProductDto, DateTime, bool> isValid = (product, _) =>
            product.ExpirationDate.Date > DateTime.UtcNow.Date;

        return isValid;
    }
}
