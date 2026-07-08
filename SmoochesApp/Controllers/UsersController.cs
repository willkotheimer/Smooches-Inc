using Microsoft.AspNetCore.Mvc;
using SmoochesApp.Dtos;
using SmoochesApp.Models;
using SmoochesApp.Services;

namespace SmoochesApp.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;
    public UsersController(IUserService service) => _service = service;

    // GET /api/users?uid=xxx  -> all, or the user(s) with that Firebase Auth uid
    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAll([FromQuery] string? uid) =>
        await _service.GetAllAsync(uid);

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetById(string id)
    {
        var user = await _service.GetByKeyAsync(id);
        return user is null ? NotFound(new { error = "User not found" }) : Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<User>> Create([FromBody] User input) =>
        StatusCode(StatusCodes.Status201Created, await _service.CreateAsync(input));

    [HttpPatch("{id}")]
    public async Task<ActionResult<User>> Update(string id, [FromBody] UserUpdateDto changes)
    {
        var updated = await _service.UpdateAsync(id, changes);
        return updated is null ? NotFound(new { error = "User not found" }) : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) =>
        await _service.DeleteAsync(id) ? NoContent() : NotFound(new { error = "User not found" });
}
