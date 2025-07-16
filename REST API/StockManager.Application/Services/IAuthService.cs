using StockManager.Application.Common.ResultPattern;
using StockManager.Core.Application.Dtos.Authorization;

namespace StockManager.Application.Services;

public interface IAuthService
{
    Task<Result<RegisterDto>> RegisterUser(RegisterDto register);

    Task<Result<LoginResultDto>> LoginUser(LoginDto login);
}
