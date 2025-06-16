using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Core.Application.Dtos.ModelsDto;

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
