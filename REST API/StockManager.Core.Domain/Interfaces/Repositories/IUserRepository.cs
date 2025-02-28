using StockManager.Core.Domain.Models;

namespace StockManager.Core.Domain.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task AddUserAsync(User user);
        Task<User?> GetUserByIdAsync(string id);
        Task<User?> GetUserByLoginAsync(string login);
    }
}
