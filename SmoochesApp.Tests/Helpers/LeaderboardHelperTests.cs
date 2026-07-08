using SmoochesApp.Helpers;
using SmoochesApp.Models;
using Xunit;

namespace SmoochesApp.Tests.Helpers;

// Mirrors Smooches.UI/src/Helper/__tests__/LeaderboardDataHelper.test.ts.
public class LeaderboardHelperTests
{
    private static Review Review(string stars) => new() { ReviewsKey = "k", Uid = "u1", ReviewStars = stars };
    private static ToDo Todo(string completedTime) => new() { TodosKey = "k", Uid = "u", CompletedTime = completedTime };

    [Fact]
    public void TallyReviewStars_counts_into_five_buckets()
    {
        var result = LeaderboardHelper.TallyReviewStars(
            new[] { Review("1"), Review("3"), Review("3"), Review("5") });

        Assert.Equal(new[] { 1, 0, 2, 0, 1 }, result);
    }

    [Fact]
    public void TallyReviewStars_ignores_empty_and_out_of_range()
    {
        var result = LeaderboardHelper.TallyReviewStars(
            new[] { Review(""), Review("0"), Review("6") });

        Assert.Equal(new[] { 0, 0, 0, 0, 0 }, result);
    }

    [Fact]
    public void TallyReviewStars_empty_is_all_zeros()
    {
        Assert.Equal(new[] { 0, 0, 0, 0, 0 }, LeaderboardHelper.TallyReviewStars(Array.Empty<Review>()));
    }

    [Fact]
    public void CalcTaskCompletion_counts_and_ratios()
    {
        var result = LeaderboardHelper.CalcTaskCompletion(
            new[] { Todo("x"), Todo(""), Todo("y"), Todo("") });

        Assert.Equal(2, result.NumberToDos);
        Assert.Equal(0.5, result.AvgToDos);
    }

    [Fact]
    public void CalcTaskCompletion_empty_without_NaN()
    {
        var result = LeaderboardHelper.CalcTaskCompletion(Array.Empty<ToDo>());

        Assert.Equal(0, result.NumberToDos);
        Assert.Equal(0, result.AvgToDos);
    }
}
