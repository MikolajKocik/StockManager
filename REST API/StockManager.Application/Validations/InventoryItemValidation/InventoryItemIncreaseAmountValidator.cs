using FluentValidation;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.IncreaseQuantity;

namespace StockManager.Application.Validations.InventoryItemValidation;

public class InventoryItemIncreaseAmountValidator : AbstractValidator<IncreaseInventoryItemQuantityCommand>
{
    public InventoryItemIncreaseAmountValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Inventory item id must be greater than 0");
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than 0");
    }
}


