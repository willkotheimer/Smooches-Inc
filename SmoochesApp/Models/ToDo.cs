using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmoochesApp.Models;

/// <summary>Mirrors the TS <c>ToDo</c> interface / the SQL <c>Todos</c> table.</summary>
[Table("Todos")]
public class ToDo : ITimestamped, IHasUid
{
    [Key]
    public string TodosKey { get; set; } = string.Empty;
    public string Uid { get; set; } = string.Empty;      // owner the task is assigned to
    public string? TaskId { get; set; }                  // Services.ServicesKey
    public string? RequesterId { get; set; }             // requester's uid
    public string? RequestedTime { get; set; }
    public string? CompletedTime { get; set; }
    public string? ReviewId { get; set; }                // Reviews.ReviewsKey
    public string? Status { get; set; }
    public bool Hidden { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
