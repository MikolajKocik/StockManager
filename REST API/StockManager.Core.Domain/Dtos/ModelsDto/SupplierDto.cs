using StockManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Dtos.ModelsDto
{
    public class SupplierDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public AddressDto? Address { get; set; } = default!; 
        public Guid? AddressId { get; set; }
    }
}

