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