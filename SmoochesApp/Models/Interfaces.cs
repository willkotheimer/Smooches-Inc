namespace SmoochesApp.Models;

/// <summary>Entities that carry Mongoose-style created/updated timestamps.</summary>
public interface ITimestamped
{
    DateTime CreatedAt { get; set; }
    DateTime UpdatedAt { get; set; }
}

/// <summary>Entities keyed to a Firebase Auth uid (the cross-entity join key).</summary>
public interface IHasUid
{
    string Uid { get; set; }
}
