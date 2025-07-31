using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.PermissionDtos;

namespace StockManager.Application.Validations.PermissionValidation;

public class PermissionCreateValidator : AbstractValidator<PermissionCreateDto>
{
    public PermissionCreateValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(50);
        RuleFor(x => x.Description)
            .MaximumLength(200);
    }
}
