using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.InvoiceDtos;

namespace StockManager.Application.CQRS.Commands.InvoiceCommands.AddInvoice;
public sealed record AddInvoiceCommand(
    InvoiceCreateDto CreateDto
    ) : ICommand<InvoiceDto>;
