using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmoochesApp.Models;

/// <summary>Mirrors the TS <c>User</c> interface / the SQL <c>Users</c> table.</summary>
[Table("Users")]
public class User : ITimestamped, IHasUid
{
    [Key]
    public string UsersKey { get; set; } = string.Empty;
    public string Uid { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Image { get; set; }
    public string? LastSignInTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
