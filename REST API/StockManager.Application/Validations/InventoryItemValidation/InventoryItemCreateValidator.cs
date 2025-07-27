using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.Validations.InventoryItemValidation;

public class InventoryItemCreateValidator : AbstractValidator<InventoryItemCreateDto>
{
    public InventoryItemCreateValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("ProductId must be greater than 0");
        RuleFor(x => x.BinLocationId)
            .GreaterThan(0).WithMessage("BinLocationId must be greater than 0");
        RuleFor(x => x.Warehouse)
            .NotEmpty().WithMessage("Warehouse is required");
        RuleFor(x => x.QuantityOnHand)
            .GreaterThanOrEqualTo(0).WithMessage("QuantityOnHand must be non-negative");
        RuleFor(x => x.QuantityReserved)
            .GreaterThanOrEqualTo(0).WithMessage("QuantityReserved must be non-negative");
    }
}
