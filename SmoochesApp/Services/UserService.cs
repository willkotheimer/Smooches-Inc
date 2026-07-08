using SmoochesApp.Dtos;
using SmoochesApp.Helpers;
using SmoochesApp.Models;
using SmoochesApp.Repositories;

namespace SmoochesApp.Services;

public interface IUserService
{
    Task<List<User>> GetAllAsync(string? uid);
    Task<User?> GetByKeyAsync(string key);
    Task<User> CreateAsync(User input);
    Task<User?> UpdateAsync(string key, UserUpdateDto changes);
    Task<bool> DeleteAsync(string key);
}

public class UserService : IUserService
{
    private readonly IUserRepository _repo;
    public UserService(IUserRepository repo) => _repo = repo;

    public Task<List<User>> GetAllAsync(string? uid) =>
        string.IsNullOrEmpty(uid) ? _repo.GetAllAsync() : _repo.GetByUidAsync(uid);

    public Task<User?> GetByKeyAsync(string key) => _repo.GetByKeyAsync(key);

    public Task<User> CreateAsync(User input)
    {
        input.UsersKey = IdKeyHelper.EnsureKey(input.UsersKey);
        return _repo.AddAsync(input);
    }

    public async Task<User?> UpdateAsync(string key, UserUpdateDto changes)
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
