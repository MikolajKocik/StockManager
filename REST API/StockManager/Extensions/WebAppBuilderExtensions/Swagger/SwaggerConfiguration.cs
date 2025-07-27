using Microsoft.OpenApi.Models;

namespace StockManager.Extensions.WebAppBuilderExtensions.Swagger;

internal static class SwaggerConfiguration
{
    public static void AddSwagger(WebApplicationBuilder builder)
    {
        // configurte jwt in swagger
        builder.Services.AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Provide JWT Token without 'Bearer' prefix"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                 {
                     new OpenApiSecurityScheme
                     {
                           Reference = new OpenApiReference
                           {
                               Type = ReferenceType.SecurityScheme,
                               Id = "bearerAuth"
                           }
                     },
                     Array.Empty<string>()
                 }
            });
        });
    }
}
