using SmoochesApp.Dtos;
using SmoochesApp.Helpers;
using SmoochesApp.Models;
using SmoochesApp.Repositories;

namespace SmoochesApp.Services;

public interface IToDoService
{
    Task<List<ToDo>> GetAllAsync(string? uid);
    Task<ToDo?> GetByKeyAsync(string key);
    Task<ToDo> CreateAsync(ToDo input);
    Task<ToDo?> UpdateAsync(string key, ToDoUpdateDto changes);
    Task<bool> DeleteAsync(string key);
}

public class ToDoService : IToDoService
{
    private readonly IToDoRepository _repo;
    public ToDoService(IToDoRepository repo) => _repo = repo;

    public Task<List<ToDo>> GetAllAsync(string? uid) =>
        string.IsNullOrEmpty(uid) ? _repo.GetAllAsync() : _repo.GetByUidAsync(uid);

    public Task<ToDo?> GetByKeyAsync(string key) => _repo.GetByKeyAsync(key);

    public Task<ToDo> CreateAsync(ToDo input)
    {
        input.TodosKey = IdKeyHelper.EnsureKey(input.TodosKey);
        return _repo.AddAsync(input);
    }

    public async Task<ToDo?> UpdateAsync(string key, ToDoUpdateDto changes)
    {
        var entity = await _repo.GetByKeyAsync(key);
        if (entity is null) return null;
        changes.ApplyTo(entity);
        return await _repo.UpdateAsync(entity);
    }

    public async Task<bool> DeleteAsync(string key)
    {
        var entity = await _repo.GetByKeyAsync(key);
        if (entity is null) return false;
        await _repo.DeleteAsync(entity);
        return true;
    }
}
