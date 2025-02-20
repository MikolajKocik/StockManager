using MediatR;
using StockManager.Application.Dtos;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct
{
    public class EditProductCommand : IRequest<ProductDto>
    {
        public int Id { get; set; }

        public EditProductCommand(int id)
        {
            Id = id;
        }
    }
}
