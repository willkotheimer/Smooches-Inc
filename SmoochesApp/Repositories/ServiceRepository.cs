using Microsoft.EntityFrameworkCore;
using SmoochesApp.Data;
using SmoochesApp.Models;

namespace SmoochesApp.Repositories;

public interface IServiceRepository : IRepository<Service>
{
    // active: null = both, true/false = filter by offered state.
    Task<List<Service>> GetByUidAsync(string uid, bool? active);
}

public class ServiceRepository : EfRepository<Service>, IServiceRepository
{
    public ServiceRepository(SmoochesDbContext db) : base(db) { }

    public Task<List<Service>> GetByUidAsync(string uid, bool? active)
    {
        var query = Db.Services.AsNoTracking().Where(s => s.Uid == uid);
        if (active is not null) query = query.Where(s => s.Active == active.Value);
        return query.ToListAsync();
    }
}
