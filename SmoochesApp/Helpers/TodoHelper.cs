using SmoochesApp.Models;

namespace SmoochesApp.Helpers;

/// <summary>Ports of the TS <c>TodoDataHelper</c> pure functions.</summary>
public static class TodoHelper
{
    /// <summary>Count todos grouped by taskId, as [taskId, count] pairs (first-seen order).</summary>
    public static List<(string TaskId, int Count)> CountTodosByTask(IEnumerable<ToDo> todos)
    {
        var counts = new Dictionary<string, int>();
        var order = new List<string>();
        foreach (var todo in todos)
        {
            var key = todo.TaskId ?? string.Empty;
            if (!counts.ContainsKey(key))
            {
                counts[key] = 0;
                order.Add(key);
            }
            counts[key]++;
        }
        return order.Select(key => (key, counts[key])).ToList();
    }

    /// <summary>Todos that are completed but not yet reviewed.</summary>
    public static List<ToDo> FilterCompletedUnreviewed(IEnumerable<ToDo> todos) =>
        todos
            .Where(t => !string.IsNullOrEmpty(t.CompletedTime) && string.IsNullOrEmpty(t.ReviewId))
            .ToList();
}
