using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Common.ResultPattern
{
    public interface IResult
    {
        bool IsSuccess { get; }
        Error? Error { get; }
    }
}
