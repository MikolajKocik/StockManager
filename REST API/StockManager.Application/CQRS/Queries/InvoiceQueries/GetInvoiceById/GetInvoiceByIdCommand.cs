using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.InvoiceDtos;

namespace StockManager.Application.CQRS.Queries.InvoiceQueries.GetInvoiceById;
public sealed record GetInvoiceByIdQuery(
    int Id
    ) : IQuery<InvoiceDto>;
