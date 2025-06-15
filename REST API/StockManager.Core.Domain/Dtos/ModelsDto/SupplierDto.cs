using StockManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Dtos.ModelsDto
{
    public sealed class SupplierDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; } 
        public AddressDto? Address { get; set; } 
        public Guid? AddressId { get; set; }
    }
}

