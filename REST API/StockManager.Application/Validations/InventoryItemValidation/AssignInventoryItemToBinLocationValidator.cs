using FluentValidation;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.AssignToBinLocation;

namespace StockManager.Application.Validations.InventoryItemValidation;

public class AssignInventoryItemToBinLocationValidator : AbstractValidator<AssignInventoryItemToBinLocationCommand>
{
    public AssignInventoryItemToBinLocationValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Inventory item id must be greater than 0");
        RuleFor(x => x.NewBinLocationId)
            .GreaterThan(0).WithMessage("Bin location id must be greater than 0");
    }
}
