using Microsoft.EntityFrameworkCore;
using SmoochesApp.Data;
using SmoochesApp.Models;

namespace SmoochesApp.Repositories;

public interface IServiceRepository : IRepository<Service>
{
    Task<List<Service>> GetByUidAsync(string uid);
}

public class ServiceRepository : EfRepository<Service>, IServiceRepository
{
    public ServiceRepository(SmoochesDbContext db) : base(db) { }

    public Task<List<Service>> GetByUidAsync(string uid) =>
        Db.Services.AsNoTracking().Where(s => s.Uid == uid).ToListAsync();
}
