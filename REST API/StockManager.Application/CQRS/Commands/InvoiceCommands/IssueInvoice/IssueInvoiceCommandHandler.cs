using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Invoice;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Application.CQRS.Commands.InvoiceCommands.IssueInvoice;

public sealed class IssueInvoiceCommandHandler(
        IInvoiceRepository repository,
        ILogger<IssueInvoiceCommandHandler> logger,
        IInvoiceService service,
        IUnitOfWork uow
    ) : ICommandHandler<IssueInvoiceCommand, Unit>
{
    private readonly IInvoiceRepository _repository = repository;
    private readonly ILogger<IssueInvoiceCommandHandler> _logger = logger;
    private readonly IInvoiceService _service = service;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(IssueInvoiceCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Invoice? invoice = await _repository.GetInvoiceByIdAsync(command.Id, ct);
        if (invoice is null)
        {
            return Result<Unit>.Failure(
                new Error(
                    $"Invoice {command.Id} not found",
                    ErrorCodes.InvoiceNotFound));
        }


        _service.Issue(invoice);
        await _uow.SaveChangesAsync(ct);
        InvoiceLogInfo.LogInvoiceIssued(_logger, invoice.Id, DateTime.UtcNow, default);

        return Result<Unit>.Success(Unit.Value);
    }
}
