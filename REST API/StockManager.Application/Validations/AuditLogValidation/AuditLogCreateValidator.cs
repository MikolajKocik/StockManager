using FluentValidation;
using StockManager.Application.Dtos.ModelsDto.AuditLogDtos;

namespace StockManager.Application.Validations.AuditLogValidation;

public class AuditLogCreateValidator : AbstractValidator<AuditLogCreateDto>
{
    public AuditLogCreateValidator()
    {
        RuleFor(x => x.EntityName)
            .NotEmpty().WithMessage("EntityName is required")
            .MaximumLength(100);
        RuleFor(x => x.EntityId)
            .GreaterThan(0).WithMessage("EntityId must be greater than 0");
        RuleFor(x => x.Action)
            .NotEmpty().WithMessage("Action is required")
            .MaximumLength(50);
        RuleFor(x => x.ChangedById)
            .NotEmpty().WithMessage("ChangedById is required")
            .MaximumLength(50);
        RuleFor(x => x.Changes)
            .NotEmpty().WithMessage("Changes is required");
    }
}
