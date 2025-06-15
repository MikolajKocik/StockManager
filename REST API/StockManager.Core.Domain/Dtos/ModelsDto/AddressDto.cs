using StockManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Dtos.ModelsDto
{
    public sealed class AddressDto
    {
        public Guid Id { get; set; }
        public required string City { get; set; } 
        public required string Country { get; set; }
        public required string PostalCode { get; set; } 
        public Guid SupplierId { get; set; }
    }
}
