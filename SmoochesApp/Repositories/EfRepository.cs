using Microsoft.EntityFrameworkCore;
using SmoochesApp.Data;

namespace SmoochesApp.Repositories;

/// <summary>EF Core implementation of <see cref="IRepository{T}"/>. Uses FindAsync,
/// which resolves by primary key regardless of the entity's key column name.</summary>
public class EfRepository<T> : IRepository<T> where T : class
{
    protected readonly SmoochesDbContext Db;
    protected DbSet<T> Set => Db.Set<T>();

    public EfRepository(SmoochesDbContext db) => Db = db;

    public virtual async Task<List<T>> GetAllAsync() =>
        await Set.AsNoTracking().ToListAsync();

    public virtual async Task<T?> GetByKeyAsync(string key) =>
        await Set.FindAsync(key);

    public virtual async Task<T> AddAsync(T entity)
    {
        Set.Add(entity);
        await Db.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        Set.Update(entity);
        await Db.SaveChangesAsync();
        return entity;
    }

    public virtual async Task DeleteAsync(T entity)
    {
        Set.Remove(entity);
        await Db.SaveChangesAsync();
    }
}
