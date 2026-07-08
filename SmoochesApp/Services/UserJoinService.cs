using SmoochesApp.Dtos;
using SmoochesApp.Helpers;
using SmoochesApp.Models;
using SmoochesApp.Repositories;

namespace SmoochesApp.Services;

public interface IUserJoinService
{
    Task<List<UserJoin>> GetAllAsync(string? uid);
    Task<UserJoin?> GetByKeyAsync(string key);
    Task<UserJoin> CreateAsync(UserJoin input);
    Task<UserJoin?> UpdateAsync(string key, UserJoinUpdateDto changes);
    Task<bool> DeleteAsync(string key);
}

public class UserJoinService : IUserJoinService
{
    private readonly IUserJoinRepository _repo;
    public UserJoinService(IUserJoinRepository repo) => _repo = repo;

    public Task<List<UserJoin>> GetAllAsync(string? uid) =>
        string.IsNullOrEmpty(uid) ? _repo.GetAllAsync() : _repo.GetByUidAsync(uid);

    public Task<UserJoin?> GetByKeyAsync(string key) => _repo.GetByKeyAsync(key);

    public Task<UserJoin> CreateAsync(UserJoin input)
    {
        input.UserJoinsKey = IdKeyHelper.EnsureKey(input.UserJoinsKey);
        return _repo.AddAsync(input);
    }

    public async Task<UserJoin?> UpdateAsync(string key, UserJoinUpdateDto changes)
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
