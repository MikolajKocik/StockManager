using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface ISalesOrderRepository 
{
    IQueryable<SalesOrder> GetSalesOrders();

    Task<SalesOrder?> GetSalesOrderByIdAsync(int id, CancellationToken cancellationToken);

    Task<SalesOrder> AddSalesOrderAsync(SalesOrder entity, CancellationToken cancellationToken);

    Task<SalesOrder> UpdateSalesOrderAsync(SalesOrder entity, CancellationToken cancellationToken);

    Task<SalesOrder> DeleteSalesOrderAsync(SalesOrder entity, CancellationToken cancellationToken);
}
