using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Castle.Core.Logging;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Tests.TestHelpers.ProductFactory;

namespace StockManager.Application.Tests.Common.PipelineBehavior;

public sealed class TrackingBehaviorTests
{
    [Fact]
    public async Task Handle_ShouldThrow_WhenCancellationRequested()
    {
        //
        NullLogger<TrackingBehavior<GetProductByIdQuery, Result<ProductCreateDto>>> logger = 
            NullLogger<TrackingBehavior<GetProductByIdQuery, Result<ProductCreateDto>>>.Instance;

        var behavior = new TrackingBehavior<GetProductByIdQuery, Result<ProductCreateDto>>(logger);

        using var cts = new CancellationTokenSource();
        await cts.CancelAsync();

        var query = new GetProductByIdQuery(1);
        ProductCreateDto data = ProductTestDtoFactory.CreateTestDto();

        //
        var next = new RequestHandlerDelegate<Result<ProductCreateDto>>(() => Task.FromResult(Result<ProductCreateDto>.Success(data)));

        Func<Task> act = async () => await behavior.Handle(query, next, cts.Token);

        //
        await act.Should().ThrowAsync<OperationCanceledException>();
    }
}
