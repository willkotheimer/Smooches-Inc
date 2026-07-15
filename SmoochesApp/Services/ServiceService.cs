using SmoochesApp.Dtos;
using SmoochesApp.Helpers;
using SmoochesApp.Models;
using SmoochesApp.Repositories;

namespace SmoochesApp.Services;

/// <summary>Outcome of a service delete: preset-sourced services can't be deleted.</summary>
public enum DeleteResult
{
    Deleted,
    NotFound,
    Forbidden,
}

public interface IServiceService
{
    Task<List<Service>> GetAllAsync(string? uid, bool? active);
    Task<Service?> GetByKeyAsync(string key);
    Task<Service> CreateAsync(Service input);
    Task<Service?> UpdateAsync(string key, ServiceUpdateDto changes);
    Task<DeleteResult> DeleteAsync(string key);
}

public class ServiceService : IServiceService
{
    private readonly IServiceRepository _repo;
    public ServiceService(IServiceRepository repo) => _repo = repo;

    public Task<List<Service>> GetAllAsync(string? uid, bool? active) =>
        string.IsNullOrEmpty(uid) ? _repo.GetAllAsync() : _repo.GetByUidAsync(uid, active);

    public Task<Service?> GetByKeyAsync(string key) => _repo.GetByKeyAsync(key);

    public Task<Service> CreateAsync(Service input)
    {
        input.ServicesKey = IdKeyHelper.EnsureKey(input.ServicesKey);
        return _repo.AddAsync(input);
    }

    public async Task<Service?> UpdateAsync(string key, ServiceUpdateDto changes)
    {
        var entity = await _repo.GetByKeyAsync(key);
        if (entity is null) return null;
        changes.ApplyTo(entity);
        return await _repo.UpdateAsync(entity);
    }

    // Only user-created ('custom') services can be deleted; presets can be deactivated.
    public async Task<DeleteResult> DeleteAsync(string key)
    {
        var entity = await _repo.GetByKeyAsync(key);
        if (entity is null) return DeleteResult.NotFound;
        if (entity.Source == "preset") return DeleteResult.Forbidden;
        await _repo.DeleteAsync(entity);
        return DeleteResult.Deleted;
    }
}
