using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Customer;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.CustomerEntity;

namespace StockManager.Application.CQRS.Commands.CustomerCommands.AddCustomer;

public sealed class AddCustomerCommandHandler : ICommandHandler<AddCustomerCommand, CustomerDto>
{
    private readonly ICustomerRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<AddCustomerCommandHandler> _logger;

    public AddCustomerCommandHandler(
        ICustomerRepository repository, 
        IMapper mapper,
        ILogger<AddCustomerCommandHandler> logger
        )
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<CustomerDto>> Handle(AddCustomerCommand command, CancellationToken cancellationToken)
    {
        try
        {
            ResultFailureHelper.IfProvidedNullArgument(command.CreateDto);

            Customer customer = _mapper.Map<Customer>(command.CreateDto);

            Customer created = await _repository.AddCustomerAsync(customer, cancellationToken);
            CustomerDto dto = _mapper.Map<CustomerDto>(created);

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
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
