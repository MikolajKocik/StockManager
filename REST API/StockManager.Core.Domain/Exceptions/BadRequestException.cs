using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Exceptions
{
    public class BadRequestException(string resourceType, string resourceIdentifier)
        : Exception($"{resourceType} with id: {resourceIdentifier} doesn't exist");
}
