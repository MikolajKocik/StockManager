using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Helpers.NullConfiguration;
using StockManager.Application.Services;
using StockManager.Core.Application.Dtos.Authorization;
using StockManager.Core.Domain.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StockManager.Infrastructure.Services.Auth;

public class AuthService : IAuthService
{
    private readonly ILogger<AuthService> _logger;
    private readonly UserManager<User> _userManager;

    public AuthService(ILogger<AuthService> logger, UserManager<User> userManager)
    {
        _logger = logger;
        _userManager = userManager;
    }

    public async Task<Result<RegisterDto>> RegisterUser(RegisterDto register)
    {
        User? existingUser = await _userManager.FindByNameAsync(register.UserName);

        if (existingUser is not null)
        {
            GeneralLogWarning.UserAlreadyExists(_logger, register.UserName, default);

            var error = new Error(
                $"User: {existingUser} already exists",
                ErrorCodes.UserConflict
            );

            return Result<RegisterDto>.Failure(error);
        }
        else
        {
            var user = new User(register.UserName, register.Password);

            IdentityResult result = await _userManager.CreateAsync(user, register.Password);

            if (!result.Succeeded)
            {
                GeneralLogWarning.RegistrationFailedService(_logger, register.UserName, default);

                var error = new Error(
                    $"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}",
                    ErrorCodes.UserValidation
                );

                return Result<RegisterDto>.Failure(error);
            }
            else
            {
                GeneralLogInfo.RegistrationSuccess(_logger, register.UserName, default);

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
                ErrorCodes.UserUnauthorized
            );

            return Result<LoginResultDto>.Failure(error);
        }

        var tokenHandler = new JwtSecurityTokenHandler();

        byte[] key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT__Key")!);
        string? issuer = Environment.GetEnvironmentVariable("JWT__Issuer")!;
        string? audience = Environment.GetEnvironmentVariable("JWT__Audience")!;

        NullCheck.IsConfigured(key, issuer, audience);

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
            Audience = audience,
            Issuer = issuer,
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

