using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.Mappings.StockTransactionProfile;

public class StockTransactionMappingProfile : Profile
{
    public StockTransactionMappingProfile()
    {
        CreateMap<StockTransaction, StockTransactionDto>().ReverseMap();
        CreateMap<StockTransactionCreateDto, StockTransaction>();
        CreateMap<StockTransactionUpdateDto, StockTransaction>();
    }
}
