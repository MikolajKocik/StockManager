using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Common.ResultPattern
{
    public sealed class Error
    {
        public Error(string message, string code)
        {
            Message = message;
            Code = code;
        }

        public string Message { get; }
        public string Code { get; }
    }
}
