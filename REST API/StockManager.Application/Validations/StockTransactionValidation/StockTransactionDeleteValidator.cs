using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;

namespace StockManager.Application.Validations.StockTransactionValidation;

public class StockTransactionDeleteValidator : AbstractValidator<StockTransactionDeleteDto>
{
    public StockTransactionDeleteValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");
    }
}
