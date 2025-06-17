using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct
{
    public sealed class DeleteProductCommand : ICommand<ProductDto>
    {
        public int Id { get; set; }

        public DeleteProductCommand(int id)
        {
            Id = id;
        }
    }
}
