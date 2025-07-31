using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.Validations.InventoryItemValidation;

public class InventoryItemUpdateValidator : AbstractValidator<InventoryItemUpdateDto>
{
    public InventoryItemUpdateValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
        RuleFor(x => x.ProductId)
            .GreaterThan(0).When(x => x.ProductId.HasValue).WithMessage("ProductId must be greater than 0 if provided");
        RuleFor(x => x.BinLocationId)
            .GreaterThan(0).When(x => x.BinLocationId.HasValue).WithMessage("BinLocationId must be greater than 0 if provided");
        RuleFor(x => x.Warehouse)
            .NotEmpty().WithMessage("Warehouse is required");
        RuleFor(x => x.QuantityOnHand)
            .GreaterThanOrEqualTo(0).When(x => x.QuantityOnHand.HasValue).WithMessage("QuantityOnHand must be non-negative if provided");
        RuleFor(x => x.QuantityReserved)
            .GreaterThanOrEqualTo(0).When(x => x.QuantityReserved.HasValue).WithMessage("QuantityReserved must be non-negative if provided");
    }
}
