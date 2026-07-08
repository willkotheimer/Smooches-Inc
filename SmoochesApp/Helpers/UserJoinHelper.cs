using System.Linq.Expressions;
using SmoochesApp.Models;

namespace SmoochesApp.Helpers;

/// <summary>
/// Port of the TS <c>filterJoinedUsersByUid</c>: a join matches a uid when it is
/// either participant. Exposed as an Expression so the same rule is EF-translatable
/// (used by the repository) and unit-testable (compiled in tests).
/// </summary>
public static class UserJoinHelper
{
    public static Expression<Func<UserJoin, bool>> MatchesUid(string uid) =>
        join => join.User1FBKey == uid || join.User2FBKey == uid;

    public static IEnumerable<UserJoin> FilterByUid(IEnumerable<UserJoin> joins, string uid) =>
        joins.Where(MatchesUid(uid).Compile());
}
