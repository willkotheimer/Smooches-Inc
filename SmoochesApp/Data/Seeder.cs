using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SmoochesApp.Helpers;
using SmoochesApp.Models;

namespace SmoochesApp.Data;

/// <summary>
/// .NET port of the Node <c>seedDatabase</c>: loads the anonymized Firebase export
/// into SQL Server once, when the database is empty. Inserts parents before children
/// so the schema's foreign keys are satisfied.
/// </summary>
public static class Seeder
{
    public static async Task SeedAsync(SmoochesDbContext db, string jsonPath)
    {
        if (!File.Exists(jsonPath)) return;
        if (await db.Users.AnyAsync() || await db.Services.AnyAsync()) return; // idempotent

        using var doc = JsonDocument.Parse(await File.ReadAllTextAsync(jsonPath));
        var root = doc.RootElement;
        var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);

        // Dependency order: Users -> Services -> Todos -> Reviews -> UserJoins.
        await InsertAsync(db, Map<User>(root, "users", options, e => e.UsersKey = IdKeyHelper.EnsureKey(e.UsersKey)));
        await InsertAsync(db, Map<Service>(root, "services", options, e => e.ServicesKey = IdKeyHelper.EnsureKey(e.ServicesKey)));
        await InsertAsync(db, Map<ToDo>(root, "todo", options, e => e.TodosKey = IdKeyHelper.EnsureKey(e.TodosKey)));
        await InsertAsync(db, Map<Review>(root, "review", options, e => e.ReviewsKey = IdKeyHelper.EnsureKey(e.ReviewsKey)));
        await InsertAsync(db, Map<UserJoin>(root, "userjoin", options, e => e.UserJoinsKey = IdKeyHelper.EnsureKey(e.UserJoinsKey)));
    }

    private static async Task InsertAsync<T>(SmoochesDbContext db, List<T> entities) where T : class
    {
        if (entities.Count == 0) return;
        db.Set<T>().AddRange(entities);
        await db.SaveChangesAsync();
    }

    private static List<T> Map<T>(
        JsonElement root, string section, JsonSerializerOptions options, Action<T> ensureKey)
    {
        var result = new List<T>();
        if (!root.TryGetProperty(section, out var node) || node.ValueKind != JsonValueKind.Object)
            return result;

        foreach (var record in node.EnumerateObject())
        {
            var entity = record.Value.Deserialize<T>(options);
            if (entity is null) continue;
            ensureKey(entity);
            result.Add(entity);
        }
        return result;
    }
}
