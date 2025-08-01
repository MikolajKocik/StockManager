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

namespace StockManager.Application.CQRS.Commands.InvoiceCommands.IssueInvoice;
public sealed class IssueInvoiceCommandHandler : ICommandHandler<IssueInvoiceCommand, Unit>
{
    private readonly IInvoiceRepository _repository;
    private readonly ILogger<IssueInvoiceCommandHandler> _logger;
    private readonly IInvoiceService _service;

    public IssueInvoiceCommandHandler(
        IInvoiceRepository repository,
        ILogger<IssueInvoiceCommandHandler> logger,
        IInvoiceService service
        )
    {
        _repository = repository;
        _logger = logger;
        _service = service;
    }

    public async Task<Result<Unit>> Handle(IssueInvoiceCommand command, CancellationToken cancellationToken)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.Id);

        Invoice? invoice = await _repository.GetInvoiceByIdAsync(command.Id, cancellationToken);
        if (invoice is null)
        {
            return Result<Unit>.Failure(
                new Error(
                    $"Invoice {command.Id} not found", 
                    ErrorCodes.InvoiceNotFound));
        }

        try
        {
            _service.Issue(invoice);
            await _repository.UpdateInvoiceAsync(invoice, cancellationToken);
            InvoiceLogInfo.LogInvoiceIssued(_logger, invoice.Id, DateTime.UtcNow, default);

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
