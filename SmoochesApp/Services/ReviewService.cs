using SmoochesApp.Dtos;
using SmoochesApp.Helpers;
using SmoochesApp.Models;
using SmoochesApp.Repositories;

namespace SmoochesApp.Services;

public interface IReviewService
{
    Task<List<Review>> GetAllAsync(string? uid);
    Task<Review?> GetByKeyAsync(string key);
    Task<Review> CreateAsync(Review input);
    Task<Review?> UpdateAsync(string key, ReviewUpdateDto changes);
    Task<bool> DeleteAsync(string key);
}

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _repo;
    public ReviewService(IReviewRepository repo) => _repo = repo;

    public Task<List<Review>> GetAllAsync(string? uid) =>
        string.IsNullOrEmpty(uid) ? _repo.GetAllAsync() : _repo.GetByUidAsync(uid);

    public Task<Review?> GetByKeyAsync(string key) => _repo.GetByKeyAsync(key);

    public Task<Review> CreateAsync(Review input)
    {
        input.ReviewsKey = IdKeyHelper.EnsureKey(input.ReviewsKey);
        return _repo.AddAsync(input);
    }

    public async Task<Review?> UpdateAsync(string key, ReviewUpdateDto changes)
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
