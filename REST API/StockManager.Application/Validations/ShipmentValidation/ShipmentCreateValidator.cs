using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;

namespace StockManager.Application.Validations.ShipmentValidation;

public class ShipmentCreateValidator : AbstractValidator<ShipmentCreateDto>
{
    public ShipmentCreateValidator()
    {
        RuleFor(x => x.SalesOrderId)
            .GreaterThan(0).WithMessage("SalesOrderId must be greater than 0");
        RuleFor(x => x.TrackingNumber)
            .NotEmpty().WithMessage("TrackingNumber is required")
            .MaximumLength(50);
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required");
        RuleFor(x => x.ShippedDate)
            .NotEqual(default(DateTime)).WithMessage("ShippedDate is required");
        RuleFor(x => x.DeliveredDate)
            .NotEqual(default(DateTime)).When(x => x.DeliveredDate.HasValue).WithMessage("DeliveredDate must be a valid date if provided");
    }
}
