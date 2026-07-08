namespace SmoochesApp.Helpers;

/// <summary>
/// Generates a record's own key when the client doesn't supply one — the .NET
/// equivalent of Mongoose defaulting <c>_id</c> to a generated ObjectId string.
/// </summary>
public static class IdKeyHelper
{
    /// <summary>A fresh 24-char hex key (ObjectId-length).</summary>
    public static string NewKey() => Guid.NewGuid().ToString("N").Substring(0, 24);

    /// <summary>Returns the given key, or a fresh one when it's null/blank.</summary>
    public static string EnsureKey(string? key) =>
        string.IsNullOrWhiteSpace(key) ? NewKey() : key;
}
