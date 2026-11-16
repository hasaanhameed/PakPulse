using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PakPulse.Infrastructure.Data;

namespace PakPulse.Infrastructure;

public static class DependencyInjection
{
    /// <summary>
    /// Registers the database so other classes can ask for a PakPulseDbContext.
    /// The Api calls this once at startup: builder.Services.AddInfrastructure(connectionString).
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<PakPulseDbContext>(options => options
            .UseNpgsql(connectionString, npgsql => npgsql.UseVector())
            .UseSnakeCaseNamingConvention());

        return services;
    }
}
