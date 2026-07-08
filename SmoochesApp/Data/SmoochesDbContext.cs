using Microsoft.EntityFrameworkCore;
using SmoochesApp.Models;

namespace SmoochesApp.Data;

public class SmoochesDbContext : DbContext
{
    public SmoochesDbContext(DbContextOptions<SmoochesDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<ToDo> Todos => Set<ToDo>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<UserJoin> UserJoins => Set<UserJoin>();

    public override int SaveChanges()
    {
        StampTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        StampTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    // Mirrors Mongoose `timestamps: true`: set CreatedAt on insert, UpdatedAt on write.
    private void StampTimestamps()
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<ITimestamped>())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity.CreatedAt == default) entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }
    }
}
