using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.PermissionDtos;

namespace StockManager.Application.Validations.PermissionValidation;

public class PermissionUpdateValidator : AbstractValidator<PermissionUpdateDto>
{
    public PermissionUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.Name)
            .MaximumLength(50);
        RuleFor(x => x.Description)
            .MaximumLength(200);
    }
}
