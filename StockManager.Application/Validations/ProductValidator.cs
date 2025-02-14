using FluentValidation;
using StockManager.Application.Dtos;

namespace StockManager.Application.Validations
{
    public class ProductValidator : AbstractValidator<ProductDto>
    {
        public ProductValidator()
        {
            RuleFor(n => n.Name)
                .NotEmpty()
                .MaximumLength(50)
                .Matches(@"^[A-Za-ząęćźżłńóśĄĘĆŹŻŁŃÓŚ ]+$")
                .WithMessage("Field 'Name' is required," +
                " maximum length of this type is equal to 50 signs," +
                "it allows only aplhabetical characters.");

            RuleFor(g => g.Genre)
                .NotEmpty()
                .WithMessage("Field 'Genre' is required.");

            RuleFor(u => u.Unit)
                .MaximumLength(15)
                .WithMessage("Field 'Unit' has maximum length of 15 characters.");

            RuleFor(ed => ed.ExpirationDate)
                .NotEmpty()
                .WithMessage("Field 'Expiration Date' is required.");

            RuleFor(ed => ed.DeliveredAt)
                .NotEmpty()
                .WithMessage("Field 'Delivered At' is required.");

            RuleFor(s => s.Type)
                .NotEmpty()
                .WithMessage("Field 'Section' is required.");

            RuleFor(bn => bn.BatchNumber)
                .NotEmpty()
                .MaximumLength(200)
                .WithMessage("Field 'BatchNumber' is required, maximum length is equal to 200 characters.");

            RuleFor(sup => sup.Supplier)
                .NotEmpty()
                .WithMessage("Field 'Supplier' is required.");
        }
    }
}
