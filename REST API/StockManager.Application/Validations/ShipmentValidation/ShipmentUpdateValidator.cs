using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;

namespace StockManager.Application.Validations.ShipmentValidation;

public class ShipmentUpdateValidator : AbstractValidator<ShipmentUpdateDto>
{
    public ShipmentUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.TrackingNumber)
            .MaximumLength(50);
        RuleFor(x => x.Status)
            .NotEmpty().When(x => x.Status != null).WithMessage("Status is required if provided");
        RuleFor(x => x.ShippedDate)
            .NotEqual(default(DateTime)).When(x => x.ShippedDate.HasValue).WithMessage("ShippedDate must be a valid date if provided");
        RuleFor(x => x.DeliveredDate)
            .NotEqual(default(DateTime)).When(x => x.DeliveredDate.HasValue).WithMessage("DeliveredDate must be a valid date if provided");
    }
}
