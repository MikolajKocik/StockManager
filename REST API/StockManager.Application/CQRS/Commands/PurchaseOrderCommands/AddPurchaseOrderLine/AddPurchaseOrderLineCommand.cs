using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;

namespace StockManager.Application.CQRS.Commands.PurchaseOrder.AddPurchaseOrderLine;

public sealed record AddPurchaseOrderLineCommand(
    int PurchaseOrderId, 
    PurchaseOrderLineCreateDto Line
    ) : ICommand<Unit>;
