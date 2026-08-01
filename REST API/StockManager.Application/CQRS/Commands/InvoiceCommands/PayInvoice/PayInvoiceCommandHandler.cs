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

namespace StockManager.Application.CQRS.Commands.InvoiceCommands.PayInvoice;

public sealed class PayInvoiceCommandHandler(
        IInvoiceRepository repo,
        ILogger<PayInvoiceCommandHandler> logger,
        IInvoiceService service,
        IUnitOfWork uow
    ) : ICommandHandler<PayInvoiceCommand, Unit>
{
    private readonly IInvoiceRepository _repo = repo;
    private readonly IInvoiceService _service = service;
    private readonly ILogger<PayInvoiceCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(PayInvoiceCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Invoice? invoice = await _repo.GetInvoiceByIdAsync(command.Id, ct);
        if (invoice is null)
        {
            InvoiceLogWarning.InvoiceNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error($"Invoice {command.Id} not found",
                ErrorCodes.InvoiceNotFound));
        }

        try
        {
            _service.Pay(invoice, command.PaymentDate);
            await _uow.SaveChangesAsync(ct);

            InvoiceLogInfo.LogInvoicePayed(_logger, invoice.Id, DateTime.UtcNow, default);
            return Result<Unit>.Success(Unit.Value);
        }
        catch (InvalidOperationException ex)
        {
            return Result<Unit>.Failure(
                new Error(
                    ex.Message,
                    ErrorCodes.InvoiceValidation));
        }
    }
}
