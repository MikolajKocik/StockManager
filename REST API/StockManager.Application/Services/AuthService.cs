using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using StockManager.Core.Domain.Dtos.Authorization;
using StockManager.Core.Domain.Exceptions;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StockManager.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly ILogger<AuthService> _logger;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public AuthService(ILogger<AuthService> logger, UserManager<User> userManager, IConfiguration configuration)
        {
            _logger = logger;
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task RegisterUser(RegisterDto register)
        {
            var existingUser = await _userManager.FindByNameAsync(register.UserName);

            if (existingUser != null)
            {
                _logger.LogWarning("User: {@User} already exists", register.UserName);
                throw new ConflictException(nameof(RegisterDto), register.UserName);
            }
            else
            {
                var user = new User(register.UserName, register.Password);

                var result = await _userManager.CreateAsync(user, register.Password);

                if (!result.Succeeded)
                {
                    _logger.LogError("User: {@User} registration failed", register.UserName);
                    throw new Exception("Failed to create user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }
                else
                {
                    _logger.LogInformation("User: {@User} registered succesfully", register.UserName);
                }
            }
        }

        public async Task<LoginResultDto> LoginUser(LoginDto login)
        {
            var user = await _userManager.FindByNameAsync(login.UserName);
            if (user == null || !await _userManager.CheckPasswordAsync(user, login.Password))
                throw new UnauthorizedAccessException();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]!);

            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return new LoginResultDto { Token = tokenString };
        }
    }
}

