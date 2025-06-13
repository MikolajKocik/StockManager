using MediatR;
using StockManager.Core.Domain.Dtos.ModelsDto;

namespace StockManager.Application.CQRS.Commands.ProductCommands.AddProduct
{
    public sealed class AddProductCommand : IRequest<ProductDto>
    {
        public ProductDto Product { get; set; }

        public AddProductCommand(ProductDto product)
        {
            Product = product;
        }
    }
}
