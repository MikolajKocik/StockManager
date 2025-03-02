using StockManager.Core.Domain.Dtos.Authorization;

namespace StockManager.Core.Domain.Interfaces.Services
{
    public interface IAuthService
    {
        Task RegisterUser(RegisterDto register);

        Task<LoginResultDto> LoginUser(LoginDto login);
    }
}
