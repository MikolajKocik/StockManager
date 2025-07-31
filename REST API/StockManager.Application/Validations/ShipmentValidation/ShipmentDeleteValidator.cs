using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;

namespace StockManager.Application.Validations.ShipmentValidation;

public class ShipmentDeleteValidator : AbstractValidator<ShipmentDeleteDto>
{
    public ShipmentDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
    }
}
