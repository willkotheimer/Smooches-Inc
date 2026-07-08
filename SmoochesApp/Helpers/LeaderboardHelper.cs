using SmoochesApp.Models;

namespace SmoochesApp.Helpers;

public record TaskCompletion(int NumberToDos, double AvgToDos);

/// <summary>Ports of the TS <c>LeaderboardDataHelper</c> pure functions.</summary>
public static class LeaderboardHelper
{
    /// <summary>Tally star counts into [1★,2★,3★,4★,5★]; empty/out-of-range ignored.</summary>
    public static int[] TallyReviewStars(IEnumerable<Review> reviews)
    {
        var counts = new int[5];
        foreach (var review in reviews)
        {
            if (int.TryParse(review.ReviewStars, out var star) && star >= 1 && star <= 5)
            {
                counts[star - 1]++;
            }
        }
        return counts;
    }

    /// <summary>Completed-todo count and completion ratio (0 when there are none).</summary>
    public static TaskCompletion CalcTaskCompletion(IReadOnlyCollection<ToDo> todos)
    {
        var numberToDos = todos.Count(t => !string.IsNullOrEmpty(t.CompletedTime));
        var avgToDos = todos.Count > 0 ? (double)numberToDos / todos.Count : 0;
        return new TaskCompletion(numberToDos, avgToDos);
    }
}
