using System.Text;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using StockManager.Middlewares;

namespace StockManager.Tests.Middlewares;

public class ErrorHandlingMiddlewareTests
{
    private readonly Mock<ILogger<ErrorHandlingMiddleware>> _loggerMock;
    private readonly ErrorHandlingMiddleware _middleware;

    public ErrorHandlingMiddlewareTests()
    {
        _loggerMock = new Mock<ILogger<ErrorHandlingMiddleware>>();
        _middleware = new ErrorHandlingMiddleware(_loggerMock.Object);
    }

    private static HttpContext CreateHttpContext()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        return context;
    }

    private static string GetResponseBody(HttpContext context)
    {
        // important to set cursor on '0' position due to empty string if not set
        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body, Encoding.UTF8);
        return reader.ReadToEnd();
    }

    /// <summary>
    /// Verifies that the middleware invokes the next delegate in the pipeline when no exception is thrown.
    /// </summary>
    /// <remarks>This test ensures that the middleware correctly calls the next middleware in the pipeline and
    /// that the response status code is set to <see cref="StatusCodes.Status200OK"/>.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task InvokeAsync_Should_Invoke_Next_When_No_Exception()
    {
        // Arrange
        var context = CreateHttpContext();
        var wasCalled = false;
        Task Next(HttpContext ctx)
        {
            wasCalled = true;
            return Task.CompletedTask;
        }

        // Act
        await _middleware.InvokeAsync(context, Next);

        // Assert
        wasCalled.Should().BeTrue();
        context.Response.StatusCode.Should().Be(StatusCodes.Status200OK);
    }

    /// <summary>
    /// Verifies that the <see cref="InvokeAsync"/> method correctly handles an <see cref="ArgumentNullException"/>
    /// thrown by the next middleware in the pipeline.
    /// </summary>
    /// <remarks>This test ensures that when an <see cref="ArgumentNullException"/> is thrown, the middleware
    /// sets the HTTP response status code to <see cref="StatusCodes.Status404NotFound"/> and includes the exception
    /// message in the response body.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task InvokeAsync_Should_Handle_ArgumentNullException()
    {
        // Arrange
        var context = CreateHttpContext();
        var ex = new ArgumentNullException("param", "Param is null");
        Task Next(HttpContext ctx) => throw ex;

        // Act
        await _middleware.InvokeAsync(context, Next);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status404NotFound);
        GetResponseBody(context).Should().Contain("Param is null");
    }

    /// <summary>
    /// Verifies that the <see cref="InvokeAsync"/> method handles <see cref="ArgumentException"/> by setting the
    /// response status code to 400 (Bad Request) and including the exception message in the response body.
    /// </summary>
    /// <remarks>This test ensures that the middleware correctly processes an <see cref="ArgumentException"/>
    /// thrown by the next delegate in the pipeline, providing appropriate feedback to the client.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task InvokeAsync_Should_Handle_ArgumentException()
    {
        // Arrange
        var context = CreateHttpContext();
        var ex = new ArgumentException("Invalid argument");
        Task Next(HttpContext ctx) => throw ex;

        // Act
        await _middleware.InvokeAsync(context, Next);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
        GetResponseBody(context).Should().Contain("Invalid argument");
    }

    /// <summary>
    /// Verifies that the <see cref="Middleware.InvokeAsync"/> method handles an <see cref="InvalidOperationException"/>
    /// by setting the HTTP response status code to 400 (Bad Request) and including the exception message in the
    /// response body.
    /// </summary>
    /// <remarks>This test ensures that the middleware properly catches and processes <see
    /// cref="InvalidOperationException"/>  thrown by the next request delegate in the pipeline, converting it into a
    /// client-friendly error response.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task InvokeAsync_Should_Handle_InvalidOperationException()
    {
        // Arrange
        var context = CreateHttpContext();
        var ex = new InvalidOperationException("Invalid operation");
        Task Next(HttpContext ctx) => throw ex;

        // Act
        await _middleware.InvokeAsync(context, Next);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
        GetResponseBody(context).Should().Contain("Invalid operation");
    }

    /// <summary>
    /// Verifies that the <see cref="InvokeAsync"/> method handles generic exceptions by setting the response status
    /// code      to 500 (Internal Server Error) and including the exception message in the response body.
    /// </summary>
    /// <remarks>This test ensures that the middleware properly catches and processes unhandled exceptions,
    /// providing a consistent      error response to the client. The response body is expected to contain the exception
    /// message for debugging purposes.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task InvokeAsync_Should_Handle_Generic_Exception()
    {
        // Arrange
        var context = CreateHttpContext();
        var ex = new Exception("General error");
        Task Next(HttpContext ctx) => throw ex;

        // Act
        await _middleware.InvokeAsync(context, Next);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
        GetResponseBody(context).Should().Contain("General error");
    }

    /// <summary>
    /// Verifies that the <see cref="Middleware.InvokeAsync"/> method correctly handles a generic exception with an
    /// inner exception by setting the appropriate HTTP response status code and including the inner exception message
    /// in the response body.
    /// </summary>
    /// <remarks>This test ensures that when a generic exception containing an inner exception is thrown
    /// during the request pipeline, the middleware responds with a 500 Internal Server Error status code and includes
    /// the inner exception's message in the response body.</remarks>
    /// <returns></returns>
    [Fact]
    public async Task InvokeAsync_Should_Handle_Generic_Exception_With_InnerException()
    {
        // Arrange
        var context = CreateHttpContext();
        var ex = new Exception("Outer", new Exception("Inner error"));
        Task Next(HttpContext ctx) => throw ex;

        // Act
        await _middleware.InvokeAsync(context, Next);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
        GetResponseBody(context).Should().Contain("Inner error");
    }
}