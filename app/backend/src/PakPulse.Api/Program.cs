using PakPulse.Infrastructure;
using PakPulse.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// The connection string comes from user secrets on each laptop, never from committed files.
var connectionString = builder.Configuration.GetConnectionString("PakPulse")
    ?? throw new InvalidOperationException("Connection string 'PakPulse' is missing. Set it with dotnet user-secrets.");
builder.Services.AddInfrastructure(connectionString);   // register the database (DI)

var app = builder.Build();

app.MapGet("/health/db", async (PakPulseDbContext db) =>   // db is supplied by DI
    await db.Database.CanConnectAsync()
        ? Results.Ok("Database connection OK")
        : Results.Problem("Cannot reach the database"));

app.Run();
