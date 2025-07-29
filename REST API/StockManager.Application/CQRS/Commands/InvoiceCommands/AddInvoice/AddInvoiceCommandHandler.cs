using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Invoice;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InvoiceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Application.CQRS.Commands.InvoiceCommands.AddInvoice;
public sealed class AddInvoiceCommandHandler : ICommandHandler<AddInvoiceCommand, InvoiceDto>
{
    private readonly IInvoiceRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<AddInvoiceCommandHandler> _logger;

    public AddInvoiceCommandHandler(
        IInvoiceRepository repository,
        IMapper mapper, ILogger<AddInvoiceCommandHandler> logger
        )
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<InvoiceDto>> Handle(AddInvoiceCommand command, CancellationToken cancellationToken)
    {
        try
        {
            Invoice entity = _mapper.Map<Invoice>(command.CreateDto);

            Invoice created = await _repository.AddInvoiceAsync(entity, cancellationToken);
            InvoiceDto dto = _mapper.Map<InvoiceDto>(created);

            InvoiceLogInfo.LogInvoiceCreated(_logger, created.Id, default);
            return Result<InvoiceDto>.Success(dto);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Result<InvoiceDto>.Failure(
                new Error(
                    "Duplicate invoice.", 
                    ErrorCodes.InvoiceConflict));
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
