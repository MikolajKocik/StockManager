using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.BinLocationDtos;

namespace StockManager.Application.Validations.BinLocationValidation;

public class BinLocationUpdateValidator : AbstractValidator<BinLocationUpdateDto>
{
    public BinLocationUpdateValidator()
    {
        RuleFor(x => x.Code)
            .MaximumLength(30);
        RuleFor(x => x.Description)
            .MaximumLength(100);
        RuleFor(x => x.Warehouse)
            .NotEmpty().WithMessage("Warehouse is required");
    }
}
