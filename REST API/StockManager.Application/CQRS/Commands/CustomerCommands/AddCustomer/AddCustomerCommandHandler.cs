using AutoMapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Customer;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.CustomerEntity;

namespace StockManager.Application.CQRS.Commands.CustomerCommands.AddCustomer;

public sealed class AddCustomerCommandHandler(
        ICustomerRepository repository,
        IMapper mapper,
        ILogger<AddCustomerCommandHandler> logger,
        IUnitOfWork uow)
    : ICommandHandler<AddCustomerCommand, CustomerDto>
{
    private readonly ICustomerRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<AddCustomerCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow; 

    public async Task<Result<CustomerDto>> Handle(AddCustomerCommand command, CancellationToken ct)
    {
        try
        {
            ResultFailureHelper.IfProvidedNullArgument(command.CreateDto);

            Customer customer = _mapper.Map<Customer>(command.CreateDto);

            _repository.AddCustomer(customer);
            await _uow.SaveChangesAsync(ct);

            CustomerDto dto = _mapper.Map<CustomerDto>(customer);

            CustomerLogInfo.LogCustomerCreated(_logger, dto.Id, default);
            return Result<CustomerDto>.Success(dto);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Result<CustomerDto>.Failure(
                new Error(
                    "Duplicate customer.", 
                    ErrorCodes.CustomerConflict));
        }
    }
}
