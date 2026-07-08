using Microsoft.EntityFrameworkCore;
using SmoochesApp.Data;
using SmoochesApp.Models;

namespace SmoochesApp.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<List<User>> GetByUidAsync(string uid);
}

public class UserRepository : EfRepository<User>, IUserRepository
{
    public UserRepository(SmoochesDbContext db) : base(db) { }

    public Task<List<User>> GetByUidAsync(string uid) =>
        Db.Users.AsNoTracking().Where(u => u.Uid == uid).ToListAsync();
}
