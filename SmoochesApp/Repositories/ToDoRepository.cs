using Microsoft.EntityFrameworkCore;
using SmoochesApp.Data;
using SmoochesApp.Models;

namespace SmoochesApp.Repositories;

public interface IToDoRepository : IRepository<ToDo>
{
    Task<List<ToDo>> GetByUidAsync(string uid);
}

public class ToDoRepository : EfRepository<ToDo>, IToDoRepository
{
    public ToDoRepository(SmoochesDbContext db) : base(db) { }

    public Task<List<ToDo>> GetByUidAsync(string uid) =>
        Db.Todos.AsNoTracking().Where(t => t.Uid == uid).ToListAsync();
}
