using SmoochesApp.Helpers;
using SmoochesApp.Models;
using Xunit;

namespace SmoochesApp.Tests.Helpers;

// Mirrors Smooches.UI/src/Helper/__tests__/TodoDataHelper.test.ts.
public class TodoHelperTests
{
    private static ToDo Todo(string taskId = "t", string completedTime = "", string reviewId = "") =>
        new() { TodosKey = "k", Uid = "u", TaskId = taskId, CompletedTime = completedTime, ReviewId = reviewId };

    [Fact]
    public void CountTodosByTask_counts_per_taskId()
    {
        var result = TodoHelper.CountTodosByTask(new[]
        {
            Todo(taskId: "a"), Todo(taskId: "a"), Todo(taskId: "b"),
        });

        Assert.Equal(new[] { ("a", 2), ("b", 1) }, result);
    }

    [Fact]
    public void CountTodosByTask_empty_returns_empty()
    {
        Assert.Empty(TodoHelper.CountTodosByTask(Array.Empty<ToDo>()));
    }

    [Fact]
    public void FilterCompletedUnreviewed_keeps_only_completed_and_unreviewed()
    {
        var completedUnreviewed = Todo(completedTime: "x", reviewId: "");
        var notCompleted = Todo(completedTime: "", reviewId: "");
        var alreadyReviewed = Todo(completedTime: "x", reviewId: "r");

        var result = TodoHelper.FilterCompletedUnreviewed(
            new[] { completedUnreviewed, notCompleted, alreadyReviewed });

        Assert.Equal(new[] { completedUnreviewed }, result);
    }
}
