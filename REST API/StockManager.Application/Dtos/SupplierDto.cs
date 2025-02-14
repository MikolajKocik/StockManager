using StockManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Dtos
{
    public class SupplierDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public AddressDto Address { get; set; } = default!; // address object
        public List<ProductDto> Products { get; set; } = new List<ProductDto>();
    }
}
