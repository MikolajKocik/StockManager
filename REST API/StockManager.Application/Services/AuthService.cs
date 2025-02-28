using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using StockManager.Application.Dtos.Authorization;
using StockManager.Core.Domain.Dtos.Authorization;
using StockManager.Core.Domain.Exceptions;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StockManager.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _repository;
        private readonly ILogger<AuthService> _logger;
        private readonly UserManager<User> _userManager;
        public AuthService(IUserRepository repository, ILogger<AuthService> logger, UserManager<User> userManager)
        {
            _repository = repository;
            _logger = logger;
            _userManager = userManager;
        }

        public async Task RegisterUser(RegisterDto register)
        {
            var existingUser = await _repository.GetUserByLoginAsync(register.Username);

            try
            {
                if (existingUser != null)
                {
                    _logger.LogWarning("User: {@User} already exists", register.Username);
                    throw new ConflictException(nameof(RegisterDto), register.Username);
                }
                else
                {
                    var user = new User(register.Username, register.Password);

                    PasswordHasher<User> hash = new PasswordHasher<User>();

                    var hashedPassword = hash.HashPassword(user, user.Password);

                    user.PasswordHash = hashedPassword;

                    await _repository.AddUserAsync(user);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occured while adding user");
                throw;
            }
        }

        public async Task<LoginResultDto> LoginUser(LoginDto login)
        {
            var user = await _userManager.FindByNameAsync(login.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, login.Password))
                throw new UnauthorizedAccessException();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("Secret");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.UserName!),
                    new Claim(ClaimTypes.NameIdentifier, user.Id)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return new LoginResultDto 
            { 
                Token = tokenString
            };
        }
    }
}

