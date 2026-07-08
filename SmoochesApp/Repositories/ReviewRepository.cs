using Microsoft.EntityFrameworkCore;
using SmoochesApp.Data;
using SmoochesApp.Models;

namespace SmoochesApp.Repositories;

public interface IReviewRepository : IRepository<Review>
{
    Task<List<Review>> GetByUidAsync(string uid);
}

public class ReviewRepository : EfRepository<Review>, IReviewRepository
{
    public ReviewRepository(SmoochesDbContext db) : base(db) { }

    public Task<List<Review>> GetByUidAsync(string uid) =>
        Db.Reviews.AsNoTracking().Where(r => r.Uid == uid).ToListAsync();
}
