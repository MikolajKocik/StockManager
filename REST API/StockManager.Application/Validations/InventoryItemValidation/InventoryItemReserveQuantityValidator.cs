using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.ReserveQuantity;

namespace StockManager.Application.Validations.InventoryItemValidation;
public sealed class InventoryItemReserveQuantityValidator : AbstractValidator<ReserveInventoryItemQuantityCommand>
{
    public InventoryItemReserveQuantityValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than zero.");
    }
}
