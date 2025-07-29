using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;

namespace StockManager.Application.CQRS.Commands.PurchaseOrder.EditPurchase;
public sealed record EditPurchaseOrderCommand(
    int Id, 
    PurchaseOrderUpdateDto UpdateDto
    ): ICommand<Unit>;
