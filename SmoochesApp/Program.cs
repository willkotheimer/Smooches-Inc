using Microsoft.EntityFrameworkCore;
using SmoochesApp.Data;
using SmoochesApp.Repositories;
using SmoochesApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// EF Core + SQL Server (the local "Smooches" database).
builder.Services.AddDbContext<SmoochesDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Smooches")));

// Let the React dev server call the API from the browser.
const string CorsPolicy = "SmoochesUI";
builder.Services.AddCors(options => options.AddPolicy(CorsPolicy, policy =>
    policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
          .AllowAnyHeader()
          .AllowAnyMethod()));

// DI container: repositories + services (Controller -> Service -> Repository).
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IToDoRepository, ToDoRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IUserJoinRepository, UserJoinRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IToDoService, ToDoService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IUserJoinService, UserJoinService>();

var app = builder.Build();

app.UseCors(CorsPolicy);
app.UseAuthorization();
app.MapControllers();

// Dev convenience: populate the SQL DB from the demo export the first time it's empty.
// Skipped under the integration-test host ("Testing"), which uses its own store.
if (!app.Environment.IsEnvironment("Testing"))
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<SmoochesDbContext>();
    var seedPath = Path.Combine(app.Environment.ContentRootPath, "Data", "seed-data.demo.json");
    try
    {
        await Seeder.SeedAsync(db, seedPath);
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "[seed] skipped: {Message}", ex.Message);
    }
}

app.Run();

// Exposed so WebApplicationFactory<Program> can host the app in integration tests.
public partial class Program { }
