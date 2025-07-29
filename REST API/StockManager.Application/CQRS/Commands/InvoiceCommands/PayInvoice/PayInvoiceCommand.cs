using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;

namespace StockManager.Application.CQRS.Commands.InvoiceCommands.PayInvoice;

public sealed record PayInvoiceCommand(
    int Id, 
    DateTime PaymentDate
    ) : ICommand<Unit>;
