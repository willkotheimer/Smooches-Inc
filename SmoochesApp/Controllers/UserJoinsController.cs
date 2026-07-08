using Microsoft.AspNetCore.Mvc;
using SmoochesApp.Dtos;
using SmoochesApp.Models;
using SmoochesApp.Services;

namespace SmoochesApp.Controllers;

[ApiController]
[Route("api/userjoins")]
public class UserJoinsController : ControllerBase
{
    private readonly IUserJoinService _service;
    public UserJoinsController(IUserJoinService service) => _service = service;

    // GET /api/userjoins?uid=xxx  -> all, or joins where uid is EITHER participant
    [HttpGet]
    public async Task<ActionResult<List<UserJoin>>> GetAll([FromQuery] string? uid) =>
        await _service.GetAllAsync(uid);

    [HttpGet("{id}")]
    public async Task<ActionResult<UserJoin>> GetById(string id)
    {
        var join = await _service.GetByKeyAsync(id);
        return join is null ? NotFound(new { error = "UserJoin not found" }) : Ok(join);
    }

    [HttpPost]
    public async Task<ActionResult<UserJoin>> Create([FromBody] UserJoin input) =>
        StatusCode(StatusCodes.Status201Created, await _service.CreateAsync(input));

    [HttpPatch("{id}")]
    public async Task<ActionResult<UserJoin>> Update(string id, [FromBody] UserJoinUpdateDto changes)
    {
        var updated = await _service.UpdateAsync(id, changes);
        return updated is null ? NotFound(new { error = "UserJoin not found" }) : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) =>
        await _service.DeleteAsync(id) ? NoContent() : NotFound(new { error = "UserJoin not found" });
}
