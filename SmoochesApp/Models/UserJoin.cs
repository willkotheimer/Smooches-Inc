using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmoochesApp.Models;

/// <summary>
/// Mirrors the TS <c>UserJoin</c> interface / the SQL <c>UserJoins</c> table.
/// Links two users; <c>User1FBKey</c>/<c>User2FBKey</c> hold their uids.
/// </summary>
[Table("UserJoins")]
public class UserJoin : ITimestamped
{
    [Key]
    public string UserJoinsKey { get; set; } = string.Empty;
    public string? User1FBKey { get; set; }
    public string? User2FBKey { get; set; }
    public bool Confirm { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
