using Microsoft.AspNetCore.Mvc;
using SmoochesApp.Dtos;
using SmoochesApp.Models;
using SmoochesApp.Services;

namespace SmoochesApp.Controllers;

[ApiController]
[Route("api/todos")]
public class TodosController : ControllerBase
{
    private readonly IToDoService _service;
    public TodosController(IToDoService service) => _service = service;

    // GET /api/todos?uid=xxx  -> all, or only todos owned by that uid
    [HttpGet]
    public async Task<ActionResult<List<ToDo>>> GetAll([FromQuery] string? uid) =>
        await _service.GetAllAsync(uid);

    [HttpGet("{id}")]
    public async Task<ActionResult<ToDo>> GetById(string id)
    {
        var todo = await _service.GetByKeyAsync(id);
        return todo is null ? NotFound(new { error = "ToDo not found" }) : Ok(todo);
    }

    [HttpPost]
    public async Task<ActionResult<ToDo>> Create([FromBody] ToDo input) =>
        StatusCode(StatusCodes.Status201Created, await _service.CreateAsync(input));

    [HttpPatch("{id}")]
    public async Task<ActionResult<ToDo>> Update(string id, [FromBody] ToDoUpdateDto changes)
    {
        var updated = await _service.UpdateAsync(id, changes);
        return updated is null ? NotFound(new { error = "ToDo not found" }) : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) =>
        await _service.DeleteAsync(id) ? NoContent() : NotFound(new { error = "ToDo not found" });
}
