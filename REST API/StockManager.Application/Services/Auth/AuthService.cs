using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using StockManager.Application.Common.ResultPattern;
using StockManager.Core.Application.Dtos.Authorization;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StockManager.Application.Services.Auth;

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

    public async Task<Result<RegisterDto>> RegisterUser(RegisterDto register)
    {
        User? existingUser = await _userManager.FindByNameAsync(register.UserName);

        if (existingUser is null)
        {
            _logger.LogWarning("User: {@user} already exists", register.UserName);

            var error = new Error(
                $"User: {existingUser} already exists",
                code: "User.Conflict"
            );

            return Result<RegisterDto>.Failure(error);
        }
        else
        {
            var user = new User(register.UserName, register.Password);

            IdentityResult result = await _userManager.CreateAsync(user, register.Password);

            if (!result.Succeeded)
            {
                _logger.LogError("User: {@user} registration failed", register.UserName);

                var error = new Error(
                    $"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}",
                    code: "User.?"
                );

                return Result<RegisterDto>.Failure(error);
            }
            else
            {
                _logger.LogInformation("User: {@user} registered succesfully", register.UserName);

                return Result<RegisterDto>.Success(register);
            }
        }
    }

    public async Task<Result<LoginResultDto>> LoginUser(LoginDto login)
    {
        User? user = await _userManager.FindByNameAsync(login.UserName);
        if (user is null || !await _userManager.CheckPasswordAsync(user, login.Password))
        {
            var error = new Error(
                $"UnauthorizedAccess {user}",
                code: "User.Unauthorized"
            );

            return Result<LoginResultDto>.Failure(error);
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        byte[] key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]!);

        IList<string> roles = await _userManager.GetRolesAsync(user);

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

        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
        string tokenString = tokenHandler.WriteToken(token);

        return Result<LoginResultDto>.Success(
            new LoginResultDto
            {
                Token = tokenString
            });
    }
}

