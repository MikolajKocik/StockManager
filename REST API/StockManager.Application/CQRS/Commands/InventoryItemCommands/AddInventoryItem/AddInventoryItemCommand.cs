using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.AddInventoryItem;
public sealed record AddInventoryItemCommand(InventoryItemCreateDto InventoryItem) : ICommand<InventoryItemDto>;
