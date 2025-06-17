using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.CQRS.Commands.ProductCommands.AddProduct
{
    public sealed class AddProductCommand : ICommand<ProductDto>
    {
        public ProductDto Product { get; set; }

        public AddProductCommand(ProductDto product)
        {
            Product = product;
        }
    }
}
