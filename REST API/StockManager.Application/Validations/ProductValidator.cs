using FluentValidation;
using StockManager.Application.Dtos;

namespace StockManager.Application.Validations
{
    public class ProductValidator : AbstractValidator<ProductDto>
    {
        public ProductValidator() // TODO validation fields on winforms
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
                .WithMessage("Field 'Unit' has maximum length of 15 characters.");

            RuleFor(ed => ed.ExpirationDate)
                .NotEmpty()
                .GreaterThan(DateTime.Now)
                .WithMessage("Field 'Expiration Date' is required.");

            RuleFor(ed => ed.DeliveredAt)
                .NotEmpty()
                .GreaterThanOrEqualTo(DateTime.Now)
                .WithMessage("Field 'Delivered At' is required.");

            RuleFor(t => t.Type)
                .NotEmpty()
                .WithMessage("Field 'Section' is required.");

            RuleFor(bn => bn.BatchNumber)
                .NotEmpty()
                .WithMessage("Field 'BatchNumber' is required")
                .MaximumLength(200)
                .WithMessage("Maximum length of field 'BatchNumber' is 200 characters.");

            RuleFor(s => s.Supplier!)
                .SetValidator(new SupplierValidator())
                .When(s => s.Supplier != null);
        }
    }
}
