using MediatR;
using StockManager.Core.Domain.Dtos.ModelsDto;

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
