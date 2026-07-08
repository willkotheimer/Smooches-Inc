using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using SmoochesApp.Json;

namespace SmoochesApp.Models;

/// <summary>
/// Mirrors the TS <c>Review</c> interface / the SQL <c>Reviews</c> table.
/// JSON names are pinned to the legacy lowercase field names (serviceid, toDoid,
/// dateTime) so the existing React client keeps working unchanged.
/// </summary>
[Table("Reviews")]
public class Review : ITimestamped, IHasUid
{
    [Key]
    public string ReviewsKey { get; set; } = string.Empty;
    public string Uid { get; set; } = string.Empty;

    [Column("ServiceId")]
    [JsonPropertyName("serviceid")]
    public string? ServiceId { get; set; }

    [Column("ToDoId")]
    [JsonPropertyName("toDoid")]
    public string? ToDoId { get; set; }

    public string? ReviewStars { get; set; }
    public string? ReviewText { get; set; }

    // Legacy mixes epoch-millis numbers and date strings — always surfaced as a string.
    [Column("DateTime")]
    [JsonPropertyName("dateTime")]
    [JsonConverter(typeof(FlexibleStringConverter))]
    public string? DateTimeText { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
