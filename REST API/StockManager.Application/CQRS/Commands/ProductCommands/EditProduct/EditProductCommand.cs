using MediatR;
using StockManager.Core.Domain.Dtos.ModelsDto;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct
{
    public sealed class EditProductCommand : IRequest<ProductDto>
    {
        public int Id { get; set; }

        public EditProductCommand(int id) 
        {
            Id = id;
        }
    }
}
