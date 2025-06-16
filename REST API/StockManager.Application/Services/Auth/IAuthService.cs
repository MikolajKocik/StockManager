using StockManager.Application.Common;
using StockManager.Core.Application.Dtos.Authorization;

namespace StockManager.Core.Domain.Interfaces.Services
{
    public interface IAuthService
    {
        Task<Result<RegisterDto>> RegisterUser(RegisterDto register);

        Task<Result<LoginResultDto>> LoginUser(LoginDto login);
    }
}
