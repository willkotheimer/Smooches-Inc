using Microsoft.AspNetCore.Mvc;

namespace SmoochesApp.Controllers;

[ApiController]
public class HealthController : ControllerBase
{
    // Mirrors Node's GET /api/health — a DB-independent liveness check.
    [HttpGet("api/health")]
    public IActionResult Get() =>
        Ok(new { status = "ok", time = DateTime.UtcNow.ToString("o") });
}
