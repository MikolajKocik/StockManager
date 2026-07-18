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

namespace StockManager.Application.CQRS.Commands.InvoiceCommands.CancelInvoice;

public sealed class CancelInvoiceCommandHandler(
        IInvoiceRepository repository,
        ILogger<CancelInvoiceCommandHandler> logger,
        IInvoiceService service,
        IUnitOfWork uow
    ) : ICommandHandler<CancelInvoiceCommand, Unit>
{
    private readonly IInvoiceRepository _repository = repository;
    private readonly IInvoiceService _service = service;
    private readonly ILogger<CancelInvoiceCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(CancelInvoiceCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Invoice? invoice = await _repository.GetInvoiceByIdAsync(command.Id, ct);
        if (invoice is null)
        {
            InvoiceLogWarning.InvoiceNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"Invoice {command.Id} not found",
                    ErrorCodes.InvoiceNotFound));
        }


        _service.Cancel(invoice);
        await _uow.SaveChangesAsync(ct);

        InvoiceLogInfo.LogInvoiceCancelled(_logger, invoice.Id, default);
        return Result<Unit>.Success(Unit.Value);
    }
}
