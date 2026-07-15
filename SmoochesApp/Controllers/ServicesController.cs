using Microsoft.AspNetCore.Mvc;
using SmoochesApp.Dtos;
using SmoochesApp.Models;
using SmoochesApp.Services;

namespace SmoochesApp.Controllers;

[ApiController]
[Route("api/services")]
public class ServicesController : ControllerBase
{
    private readonly IServiceService _service;
    public ServicesController(IServiceService service) => _service = service;

    // GET /api/services?uid=xxx&active=true
    //   ?uid filters to one owner; ?active filters by offered state.
    [HttpGet]
    public async Task<ActionResult<List<Service>>> GetAll(
        [FromQuery] string? uid, [FromQuery] bool? active) =>
        await _service.GetAllAsync(uid, active);

    [HttpGet("{id}")]
    public async Task<ActionResult<Service>> GetById(string id)
    {
        var service = await _service.GetByKeyAsync(id);
        return service is null ? NotFound(new { error = "Service not found" }) : Ok(service);
    }

    [HttpPost]
    public async Task<ActionResult<Service>> Create([FromBody] Service input) =>
        StatusCode(StatusCodes.Status201Created, await _service.CreateAsync(input));

    [HttpPatch("{id}")]
    public async Task<ActionResult<Service>> Update(string id, [FromBody] ServiceUpdateDto changes)
    {
        var updated = await _service.UpdateAsync(id, changes);
        return updated is null ? NotFound(new { error = "Service not found" }) : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) =>
        await _service.DeleteAsync(id) switch
        {
            DeleteResult.Deleted => NoContent(),
            DeleteResult.Forbidden => StatusCode(StatusCodes.Status403Forbidden,
                new { error = "Preset services can be deactivated but not deleted" }),
            _ => NotFound(new { error = "Service not found" }),
        };
}
