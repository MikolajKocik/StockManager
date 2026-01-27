using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
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

            // API Versioning
            IApiVersionDescriptionProvider provider = builder.Services.BuildServiceProvider().GetRequiredService<IApiVersionDescriptionProvider>();
            foreach (ApiVersionDescription description in provider.ApiVersionDescriptions)
            {
                c.SwaggerDoc(description.GroupName, new OpenApiInfo
                {
                    Title = $"StockManager API {description.ApiVersion}",
                    Version = description.ApiVersion.ToString(),
                    Description = description.IsDeprecated ? "This API version has been deprecated." : null
                });
            }
        });
    }
}
