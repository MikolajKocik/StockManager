using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InvoiceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Application.CQRS.Queries.InvoiceQueries.GetInvoiceById;
public sealed class GetInvoiceByIdQueryHandler : IQueryHandler<GetInvoiceByIdQuery, InvoiceDto>
{
    private readonly IInvoiceRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetInvoiceByIdQueryHandler> _logger;

    public GetInvoiceByIdQueryHandler(
        IInvoiceRepository repository,
        IMapper mapper, ILogger<GetInvoiceByIdQueryHandler> logger
        )
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<InvoiceDto>> Handle(GetInvoiceByIdQuery query, CancellationToken cancellationToken)
    {
        Invoice? invoice = await _repository.GetInvoiceByIdAsync(query.Id, cancellationToken);
        if (invoice is null)
        {
            return Result<InvoiceDto>.Failure(
                new Error(
                    $"Invoice {query.Id} not found",
                    ErrorCodes.InvoiceNotFound));
        }

        InvoiceDto dto = _mapper.Map<InvoiceDto>(invoice);
        return Result<InvoiceDto>.Success(dto);
    }
}
