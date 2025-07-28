using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;

namespace StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
public interface IBaseRepository
{
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken);
}
