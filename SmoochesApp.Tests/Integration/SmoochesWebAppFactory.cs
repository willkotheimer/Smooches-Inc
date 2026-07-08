using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmoochesApp.Data;
using SmoochesApp.Models;

namespace SmoochesApp.Tests.Integration;

/// <summary>
/// Hosts the real API in-process for endpoint tests, but swaps SQL Server for an
/// EF Core in-memory store seeded with a small known dataset.
/// </summary>
public class SmoochesWebAppFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = "SmoochesTests-" + Guid.NewGuid().ToString("N");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing"); // Program skips SQL seeding under "Testing"

        builder.ConfigureServices(services =>
        {
            // Strip the SQL Server registration completely — including the EF 9/10
            // IDbContextOptionsConfiguration<T> the provider adds — so only the
            // in-memory provider remains.
            var toRemove = services.Where(d =>
                d.ServiceType == typeof(DbContextOptions<SmoochesDbContext>) ||
                d.ServiceType == typeof(DbContextOptions) ||
                d.ServiceType == typeof(SmoochesDbContext) ||
                (d.ServiceType.IsGenericType &&
                 d.ServiceType.GetGenericTypeDefinition().Name.StartsWith("IDbContextOptionsConfiguration"))
            ).ToList();
            foreach (var descriptor in toRemove) services.Remove(descriptor);

            services.AddDbContext<SmoochesDbContext>(options => options.UseInMemoryDatabase(_dbName));
        });
    }

    // Seed after the host (and its real DI) is built, so we write to the same store.
    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);
        using var scope = host.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<SmoochesDbContext>();
        db.Database.EnsureCreated();
        TestData.Seed(db);
        return host;
    }
}

public static class TestData
{
    public const string User1Uid = "uid-user-1";
    public const string User2Uid = "uid-user-2";

    public static void Seed(SmoochesDbContext db)
    {
        if (db.Users.Any()) return;

        db.Users.AddRange(
            new User { UsersKey = "user-1", Uid = User1Uid, Name = "William", Email = "w@example.com" },
            new User { UsersKey = "user-2", Uid = User2Uid, Name = "Rachel", Email = "r@example.com" });

        db.Services.AddRange(
            new Service { ServicesKey = "svc-1", Uid = User1Uid, Name = "Bring coffee", Description = "hot" },
            new Service { ServicesKey = "svc-2", Uid = User2Uid, Name = "Do dishes", Description = "all of them" });

        db.Todos.Add(new ToDo
        {
            TodosKey = "todo-1",
            Uid = User2Uid,
            RequesterId = User1Uid,
            TaskId = "svc-2",
            Status = "pending",
            CompletedTime = "",
            ReviewId = "",
        });

        db.Reviews.Add(new Review
        {
            ReviewsKey = "review-1",
            Uid = User1Uid,
            ServiceId = "svc-2",
            ToDoId = "todo-1",
            ReviewStars = "5",
            ReviewText = "Great!",
            DateTimeText = "1608268094536",
        });

        db.UserJoins.Add(new UserJoin
        {
            UserJoinsKey = "join-1",
            User1FBKey = User1Uid,
            User2FBKey = User2Uid,
            Confirm = true,
        });

        db.SaveChanges();
    }
}
