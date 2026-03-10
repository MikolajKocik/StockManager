using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using StockManager.Application.Dtos.ModelsDto.AddressDtos;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.AddressEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SupplierEntity;
using StockManager.Infrastructure.Persistence.Data;
using TestHelpers.Fixture;
using TestHelpers.ProductFactory;
using Xunit.Abstractions;

namespace StockManager.Tests.IntegrationTests.API.ControllerTests;

public class ProductControllerTests : IClassFixture<WebApplicationTestFactory>
{
    private readonly WebApplicationTestFactory _factory;
    private readonly ITestOutputHelper _output;

    public ProductControllerTests(WebApplicationTestFactory factory, ITestOutputHelper output)
    {
        _factory = factory;
        _output = output;
    }

    [Fact]
    public async Task GetAllProducts_WithoutQueryParameters_Returns200OK()
    {
        // arrange
        HttpClient client = _factory.CreateClient();

        // act
        HttpResponseMessage result = await client.GetAsync("api/v1.0/products");
        string content = await result.Content.ReadAsStringAsync();
        _output.WriteLine(content);

        // assert
        result.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetProductById_WithNotExistingId_Returns404NotFound()
    {
        // arrange
        HttpClient client = _factory.CreateClient();

        int id = 1;

        // act
        HttpResponseMessage result = await client.GetAsync($"api/v1.0/products/{id}");
        string content = await result.Content.ReadAsStringAsync();
        _output.WriteLine(content);

        // assert
        result.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task RemoveProduct_WithNotExistingId_Returns404NotFound()
    {
        // arrange
        HttpClient client = _factory.CreateClient();

        int id = 1;
       
        // act
        HttpResponseMessage result = await client.DeleteAsync($"api/v1.0/products/{id}");
        string content = await result.Content.ReadAsStringAsync();
        _output.WriteLine(content);

        // assert
        result.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateProduct_WithoutSupplier_Returns400BadRequest()
    {
        // arrange
        HttpClient client = _factory.CreateClient();

        var productDto = new ProductCreateDto
        {
            Name = "Test",
            Genre = "Test",
            Unit = "Test",
            Type = "Test",
            BatchNumber = "Test",
            SupplierId = Guid.Empty,
            ExpirationDate = DateTime.UtcNow.AddDays(2),
        };

        // act
        HttpResponseMessage result =
            await client.PostAsJsonAsync($"api/v1.0/products", productDto);

        ValidationProblemDetails problem =
            await result.Content.ReadFromJsonAsync<ValidationProblemDetails>();

        // assert
        result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        problem!.Errors.Should().ContainKey("SupplierId");
        problem.Errors["SupplierId"].Should().Contain("SupplierId is required");
    }

    [Fact]
    public async Task CreateProduct_WithSupplier_Returns201Created()
    {
        // arrange
        using IServiceScope scope = _factory.Services.CreateScope();
        StockManagerDbContext db = scope.ServiceProvider
            .GetRequiredService<StockManagerDbContext>();

        HttpClient client = _factory.CreateClient();

        var supplierId = Guid.NewGuid();
        var addressId = Guid.NewGuid();

        var address = new Address(
            id: addressId,
            city: "TestCity",
            country: "TestCountry",
            postalCode: "12-345",
            supplierId: supplierId,
            customerId: 1
        );

        var supplier = new Supplier(
            id: supplierId,
            name: "TestSupplier",
            addressId: addressId
        );

        db.Adresses.Add(address);
        db.Suppliers.Add(supplier);
        await db.SaveChangesAsync();

        var productDto = new ProductCreateDto
        {
            Name = "Test",
            Genre = nameof(Genre.Vegetables),
            Unit = "kg",
            Type = nameof(Warehouse.RegularStorage),
            BatchNumber = "Test",
            SupplierId = supplierId,
            ExpirationDate = DateTime.UtcNow.AddDays(2)
        };

        // act
        HttpResponseMessage result =
            await client.PostAsJsonAsync($"api/v1.0/products", productDto);
        string content = await result.Content.ReadAsStringAsync();
        _output.WriteLine(content);

        // assert
        result.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
