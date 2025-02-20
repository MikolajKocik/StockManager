using MediatR;
using StockManager.Application.Dtos;

namespace StockManager.Application.CQRS.Commands.ProductCommands.AddProduct
{
    public class AddProductCommand : IRequest<ProductDto>
    {
        public ProductDto Product { get; set; }

        public AddProductCommand(ProductDto product)
        {
            Product = product;
        }
    }
}
