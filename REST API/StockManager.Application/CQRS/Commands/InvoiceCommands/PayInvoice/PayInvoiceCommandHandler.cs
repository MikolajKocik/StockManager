using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Invoice;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Application.CQRS.Commands.InvoiceCommands.PayInvoice;
public sealed class PayInvoiceCommandHandler : ICommandHandler<PayInvoiceCommand, Unit>
{
    private readonly IInvoiceRepository _repo;
    private readonly ILogger<PayInvoiceCommandHandler> _logger;
    private readonly IInvoiceService _service;

    public PayInvoiceCommandHandler(
        IInvoiceRepository repo, 
        ILogger<PayInvoiceCommandHandler> logger,
        IInvoiceService service
        )
    {
        _repo = repo;
        _service = service;
        _logger = logger;
    }

    public async Task<Result<Unit>> Handle(PayInvoiceCommand command, CancellationToken cancellationToken)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.Id);

        Invoice? invoice = await _repo.GetInvoiceByIdAsync(command.Id, cancellationToken);
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
            await _repo.UpdateInvoiceAsync(invoice, cancellationToken);

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
