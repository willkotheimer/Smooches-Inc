using SmoochesApp.Dtos;
using SmoochesApp.Helpers;
using SmoochesApp.Models;
using SmoochesApp.Repositories;

namespace SmoochesApp.Services;

public interface IServiceService
{
    Task<List<Service>> GetAllAsync(string? uid);
    Task<Service?> GetByKeyAsync(string key);
    Task<Service> CreateAsync(Service input);
    Task<Service?> UpdateAsync(string key, ServiceUpdateDto changes);
    Task<bool> DeleteAsync(string key);
}

public class ServiceService : IServiceService
{
    private readonly IServiceRepository _repo;
    public ServiceService(IServiceRepository repo) => _repo = repo;

    public Task<List<Service>> GetAllAsync(string? uid) =>
        string.IsNullOrEmpty(uid) ? _repo.GetAllAsync() : _repo.GetByUidAsync(uid);

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

    public async Task<bool> DeleteAsync(string key)
    {
        var entity = await _repo.GetByKeyAsync(key);
        if (entity is null) return false;
        await _repo.DeleteAsync(entity);
        return true;
    }
}
