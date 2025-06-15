using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Dtos.Authorization
{
    public sealed class LoginResultDto
    {
        public required string Token { get; set; } 
    }
}
