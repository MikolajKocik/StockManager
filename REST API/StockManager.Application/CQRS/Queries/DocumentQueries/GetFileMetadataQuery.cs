using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Application.CQRS.Queries.DocumentQueries;

public sealed record GetFileMetadataQuery() : IQuery<List<FileMetadata>>;
