using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Extensions.ErrorExtensions;
using StockManager.Application.Services;
using StockManager.Core.Application.Dtos.Authorization;

namespace StockManager.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
   
    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;          
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(RegisterDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RegisterDto), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterDto register)
    {
        GeneralLogInfo.RegistrationSuccess(_logger, register.UserName, default);

        Result<RegisterDto> result = await _authService.RegisterUser(register);

        if(result.IsSuccess)
        {
            return Ok(new { message = "User registered succesfully" });
        }

        GeneralLogWarning.RegistrationFailed(_logger, default);
        return result.Error!.ToActionResult();          
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(LoginResultDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(LoginResultDto), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto login)
    {

        GeneralLogInfo.AuthorizationSuccess(_logger, login.UserName, default);

        Result<LoginResultDto> result = await _authService.LoginUser(login);

        if(result.IsSuccess)
        {
            return Ok(new { message = "User logged succesfully", result });
        }

        GeneralLogWarning.AuthorizationFailed(_logger, default);
        return result.Error!.ToActionResult();
    }
}
