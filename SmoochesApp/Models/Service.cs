using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmoochesApp.Models;

/// <summary>Mirrors the TS <c>Service</c> interface / the SQL <c>Services</c> table.</summary>
[Table("Services")]
public class Service : ITimestamped, IHasUid
{
    [Key]
    public string ServicesKey { get; set; } = string.Empty;
    public string Uid { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OfferDescription { get; set; } = string.Empty;
    // Service bank: offered to the partner when true; deactivating keeps it in the bank.
    public bool Active { get; set; } = true;
    // 'custom' (user-created, deletable) | 'preset' (added from the template list)
    public string Source { get; set; } = "custom";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
