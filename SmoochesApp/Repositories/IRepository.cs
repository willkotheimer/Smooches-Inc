namespace SmoochesApp.Repositories;

/// <summary>Generic persistence contract, keyed by the entity's string key.</summary>
public interface IRepository<T> where T : class
{
    Task<List<T>> GetAllAsync();
    Task<T?> GetByKeyAsync(string key);
    Task<T> AddAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}
