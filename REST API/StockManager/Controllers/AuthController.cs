using Microsoft.AspNetCore.Mvc;
using StockManager.Core.Domain.Dtos.Authorization;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Controllers
{
    [Route("api/auth")]
    [ApiController]
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
        public async Task<IActionResult> Register([FromBody] RegisterDto register)
        {
            _logger.LogInformation("User: {@User} registered succesfully", register.UserName);

            await _authService.RegisterUser(register);
            return Ok(new { message = "User registered succesfully"});
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {

            _logger.LogInformation("User: {@User} logged succesfully", login.UserName);

            await _authService.LoginUser(login);
            return Ok(new { message = "User logged succesfully" });
        }
    }
}
