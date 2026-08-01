using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Invoice;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InvoiceDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Application.CQRS.Commands.InvoiceCommands.AddInvoice;

public sealed class AddInvoiceCommandHandler(
        IInvoiceRepository repository,
        IMapper mapper,
        ILogger<AddInvoiceCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<AddInvoiceCommand, InvoiceDto>
{
    private readonly IInvoiceRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<AddInvoiceCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<InvoiceDto>> Handle(AddInvoiceCommand command, CancellationToken ct)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.CreateDto);

        Invoice entity = _mapper.Map<Invoice>(command.CreateDto);

        _repository.AddInvoice(entity);
        await _uow.SaveChangesAsync(ct);

        InvoiceDto dto = _mapper.Map<InvoiceDto>(entity);

        InvoiceLogInfo.LogInvoiceCreated(_logger, dto.Id, null);
        return Result<InvoiceDto>.Success(dto);
    }
}
