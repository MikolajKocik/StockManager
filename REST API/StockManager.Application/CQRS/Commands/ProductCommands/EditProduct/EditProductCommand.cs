using MediatR;
using StockManager.Application.Dtos;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct
{
    public class EditProductCommand : IRequest<ProductDto>
    {
        public int Id { get; set; }
        public ProductDto Product { get; set; } = default!;

        public EditProductCommand(int id, ProductDto producDto)
        {
            Id = id;
            Product = producDto;
        }
    }
}
