using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;

namespace StockManager.Application.CQRS.Commands.PurchaseOrder.AddPurchase;
public sealed record AddPurchaseOrderCommand(
    PurchaseOrderCreateDto CreateDto
    ) : ICommand<PurchaseOrderDto>;
