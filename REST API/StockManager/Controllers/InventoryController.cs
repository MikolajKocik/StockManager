using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace StockManager.Controllers;

[ApiController]
[EnableRateLimiting("fixed")]
[Route("api/inventories")]
public sealed class InventoryController : ControllerBase
{
    
}
