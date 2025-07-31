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
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Application.CQRS.Commands.InvoiceCommands.CancelInvoice;
public sealed class CancelInvoiceCommandHandler : ICommandHandler<CancelInvoiceCommand, Unit>
{
    private readonly IInvoiceRepository _repository;
    private readonly ILogger<CancelInvoiceCommandHandler> _logger;
    private readonly IInvoiceService _service;

    public CancelInvoiceCommandHandler(
        IInvoiceRepository repository,
        ILogger<CancelInvoiceCommandHandler> logger,
        IInvoiceService service
        )
    {
        _repository = repository;
        _service = service;
        _logger = logger;
    }

    public async Task<Result<Unit>> Handle(CancelInvoiceCommand command, CancellationToken cancellationToken)
    {
        Invoice? invoice = await _repository.GetInvoiceByIdAsync(command.Id, cancellationToken);
        if (invoice is null)
        {
            InvoiceLogWarning.InvoiceNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"Invoice {command.Id} not found",
                    ErrorCodes.InvoiceNotFound));
        }

        try
        {
            _service.Cancel(invoice); 
            await _repository.UpdateInvoiceAsync(invoice, cancellationToken);

            InvoiceLogInfo.LogInvoiceCancelled(_logger, invoice.Id, default);
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
