using Microsoft.EntityFrameworkCore;
using SmoochesApp.Data;
using SmoochesApp.Helpers;
using SmoochesApp.Models;

namespace SmoochesApp.Repositories;

public interface IUserJoinRepository : IRepository<UserJoin>
{
    // Joins where the uid is EITHER participant (matches Node's $or query).
    Task<List<UserJoin>> GetByUidAsync(string uid);
}

public class UserJoinRepository : EfRepository<UserJoin>, IUserJoinRepository
{
    public UserJoinRepository(SmoochesDbContext db) : base(db) { }

    public Task<List<UserJoin>> GetByUidAsync(string uid) =>
        Db.UserJoins.AsNoTracking().Where(UserJoinHelper.MatchesUid(uid)).ToListAsync();
}
