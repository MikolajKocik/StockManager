using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Castle.Core.Logging;
using FluentAssertions;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Tests.UnitTests.TestHelpers.ProductFactory;
using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;

namespace StockManager.Application.Tests.UnitTests.Common.CancellationToken;

public sealed class TrackingBehaviorTests
{
    private readonly Mock<IEnumerable<IValidator<GetProductByIdQuery>>> _validators;
    private readonly Mock<IBaseRepository> _baseRepository;

    public TrackingBehaviorTests()
    {
        _validators = new Mock<IEnumerable<IValidator<GetProductByIdQuery>>>();
        _baseRepository = new Mock<IBaseRepository>();
    }

    [Fact]
    public async Task Handle_ShouldThrow_WhenCancellationRequested()
    {
        //
        _validators.Setup(v => v.GetEnumerator())
            .Returns(Enumerable.Empty<IValidator<GetProductByIdQuery>>().GetEnumerator());

        NullLogger<TrackingBehavior<GetProductByIdQuery, Result<ProductCreateDto>>> logger = 
            NullLogger<TrackingBehavior<GetProductByIdQuery, Result<ProductCreateDto>>>.Instance;

        var behavior = new TrackingBehavior<GetProductByIdQuery, Result<ProductCreateDto>>(
            logger, _validators.Object, _baseRepository.Object
            );

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
