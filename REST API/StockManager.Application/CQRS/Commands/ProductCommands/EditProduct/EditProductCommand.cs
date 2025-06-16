using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Core.Application.Dtos.ModelsDto;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct
{
    public sealed class EditProductCommand : ICommand<ProductDto>
    {
        public int Id { get; set; }

        public EditProductCommand(int id) 
        {
            Id = id;
        }
    }
}
