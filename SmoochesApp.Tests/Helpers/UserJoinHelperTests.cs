using SmoochesApp.Helpers;
using SmoochesApp.Models;
using Xunit;

namespace SmoochesApp.Tests.Helpers;

// Mirrors Smooches.UI/src/Helper/__tests__/UserDataHelper.test.ts.
public class UserJoinHelperTests
{
    private static UserJoin Join(string key, string user1 = "", string user2 = "") =>
        new() { UserJoinsKey = key, User1FBKey = user1, User2FBKey = user2 };

    [Fact]
    public void FilterByUid_matches_either_participant()
    {
        var asUser1 = Join("a", user1: "me");
        var asUser2 = Join("b", user2: "me");
        var unrelated = Join("c", user1: "x", user2: "y");

        var result = UserJoinHelper.FilterByUid(new[] { asUser1, asUser2, unrelated }, "me");

        Assert.Equal(new[] { asUser1, asUser2 }, result);
    }

    [Fact]
    public void FilterByUid_returns_empty_when_nothing_matches()
    {
        Assert.Empty(UserJoinHelper.FilterByUid(new[] { Join("x", user1: "x") }, "me"));
    }

    [Fact]
    public void MatchesUid_expression_compiles_and_matches()
    {
        var predicate = UserJoinHelper.MatchesUid("me").Compile();

        Assert.True(predicate(Join("a", user2: "me")));
        Assert.False(predicate(Join("b", user1: "x", user2: "y")));
    }
}
