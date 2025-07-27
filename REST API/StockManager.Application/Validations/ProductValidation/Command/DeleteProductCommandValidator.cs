using FluentValidation;
using StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.Validations.ProductValidation.Command;

public class DeleteProductCommandValidator : AbstractValidator<DeleteProductCommand>
{
    public DeleteProductCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id is required and must be greater than 0");
    }
}
