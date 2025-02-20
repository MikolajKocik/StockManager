using MediatR;
using StockManager.Application.Dtos;

namespace StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct
{
    public class DeleteProductCommand : IRequest<ProductDto>
    {
        public int Id { get; set; }

        public DeleteProductCommand(int id)
        {
            Id = id;
        }
    }
}
