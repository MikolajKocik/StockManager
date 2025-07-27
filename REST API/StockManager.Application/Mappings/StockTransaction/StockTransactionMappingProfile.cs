using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.StockTransaction;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.Mappings.StockTransaction;

public class StockTransactionMappingProfile : Profile
{
    public StockTransactionMappingProfile()
    {
        CreateMap<StockTransaction, StockTransactionDto>().ReverseMap();
        CreateMap<StockTransactionCreateDto, StockTransaction>();
        CreateMap<StockTransactionUpdateDto, StockTransaction>();
    }
}
