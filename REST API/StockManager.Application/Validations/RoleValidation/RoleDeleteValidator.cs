using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.RoleDtos;

namespace StockManager.Application.Validations.RoleValidation;

public class RoleDeleteValidator : AbstractValidator<RoleDeleteDto>
{
    public RoleDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
    }
}
