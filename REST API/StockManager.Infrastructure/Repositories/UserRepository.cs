using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models;
using StockManager.Infrastructure.Data;

namespace StockManager.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly StockManagerDbContext _context;

        public UserRepository(StockManagerDbContext context)
        {
            _context = context;
        }

        public async Task AddUserAsync(User user)
        {
            await _context.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetUserByIdAsync(string id) 
            => await _context.Users.FindAsync(id);
        
        public async Task<User?> GetUserByLoginAsync(string login)
            => await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == login);
    }
}
