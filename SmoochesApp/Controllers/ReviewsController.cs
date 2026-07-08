using Microsoft.AspNetCore.Mvc;
using SmoochesApp.Dtos;
using SmoochesApp.Models;
using SmoochesApp.Services;

namespace SmoochesApp.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _service;
    public ReviewsController(IReviewService service) => _service = service;

    // GET /api/reviews?uid=xxx  -> all, or only reviews written by that uid
    [HttpGet]
    public async Task<ActionResult<List<Review>>> GetAll([FromQuery] string? uid) =>
        await _service.GetAllAsync(uid);

    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetById(string id)
    {
        var review = await _service.GetByKeyAsync(id);
        return review is null ? NotFound(new { error = "Review not found" }) : Ok(review);
    }

    [HttpPost]
    public async Task<ActionResult<Review>> Create([FromBody] Review input) =>
        StatusCode(StatusCodes.Status201Created, await _service.CreateAsync(input));

    [HttpPatch("{id}")]
    public async Task<ActionResult<Review>> Update(string id, [FromBody] ReviewUpdateDto changes)
    {
        var updated = await _service.UpdateAsync(id, changes);
        return updated is null ? NotFound(new { error = "Review not found" }) : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) =>
        await _service.DeleteAsync(id) ? NoContent() : NotFound(new { error = "Review not found" });
}
