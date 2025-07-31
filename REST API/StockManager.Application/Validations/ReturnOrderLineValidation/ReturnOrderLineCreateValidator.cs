using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.ReturnOrderLineDtos;

namespace StockManager.Application.Validations.ReturnOrderLineValidation;

public class ReturnOrderLineCreateValidator : AbstractValidator<ReturnOrderLineCreateDto>
{
    public ReturnOrderLineCreateValidator()
    {
        RuleFor(x => x.ReturnOrderId)
            .GreaterThan(0).WithMessage("ReturnOrderId must be greater than 0");
        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("ProductId must be greater than 0");
        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0");
        RuleFor(x => x.UoM)
            .NotEmpty().WithMessage("UoM is required");
    }
}
