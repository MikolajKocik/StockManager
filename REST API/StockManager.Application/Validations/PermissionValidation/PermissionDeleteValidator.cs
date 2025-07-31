using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.PermissionDtos;

namespace StockManager.Application.Validations.PermissionValidation;

public class PermissionDeleteValidator : AbstractValidator<PermissionDeleteDto>
{
    public PermissionDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
    }
}
