namespace StockManager.Extensions.WebAppBuilderExtensions.Cors;

internal static class CorsConfiguration
{
    public static void AddCorsCredentials(WebApplicationBuilder builder)
    {
        builder.Services.AddCors(c =>
        {
            c.AddPolicy(Policy.SpecificOrigins, policy =>
            {
                policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
            });
        });
    }
}
