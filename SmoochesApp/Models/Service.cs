using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmoochesApp.Models;

/// <summary>
/// Mirrors the TS <c>Service</c> interface / the SQL <c>Services</c> table.
/// (The table also has Active/Source columns for the future "service bank"; they
/// carry SQL defaults and are intentionally not mapped here yet.)
/// </summary>
[Table("Services")]
public class Service : ITimestamped, IHasUid
{
    [Key]
    public string ServicesKey { get; set; } = string.Empty;
    public string Uid { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OfferDescription { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
