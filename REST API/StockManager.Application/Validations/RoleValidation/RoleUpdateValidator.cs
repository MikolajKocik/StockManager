using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.RoleDtos;

namespace StockManager.Application.Validations.RoleValidation;

public class RoleUpdateValidator : AbstractValidator<RoleUpdateDto>
{
    public RoleUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.Name)
            .NotEmpty().When(x => x.Name != null)
            .MaximumLength(50);
    }
}
