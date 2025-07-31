using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.BinLocationDtos;

namespace StockManager.Application.Validations.BinLocationValidation;

public class BinLocationCreateValidator : AbstractValidator<BinLocationCreateDto>
{
    public BinLocationCreateValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Code is required")
            .MaximumLength(30);
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(100);
        RuleFor(x => x.Warehouse)
            .NotEmpty().WithMessage("Warehouse is required");
    }
}
