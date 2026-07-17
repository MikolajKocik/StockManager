using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InvoiceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Application.CQRS.Queries.DocumentQueries;

public sealed class GetInvoiceByIdQueryHandler(
    IInvoiceRepository repository,
    IMapper mapper,
    ILogger<GetInvoiceByIdQueryHandler> logger) : IQueryHandler<GetInvoiceByIdQuery, InvoiceDto>
{
    private readonly IInvoiceRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<GetInvoiceByIdQueryHandler> _logger = logger;

    public async Task<Result<InvoiceDto>> Handle(GetInvoiceByIdQuery query, CancellationToken ct)
    {
        Invoice? invoice = await _repository.GetInvoiceByIdAsync(query.Id, ct);
        if (invoice is null)
        {
            GeneralLogError.ArgumentException(
                _logger,
                $"Invoice with ID {query.Id} was not found.",
                default
            );

            return Result<InvoiceDto>.Failure(
                new Error(
                    $"Invoice {query.Id} not found",
                    ErrorCodes.InvoiceNotFound));
        }

        InvoiceDto dto = _mapper.Map<InvoiceDto>(invoice);
        return Result<InvoiceDto>.Success(dto);
    }
}
