using Microsoft.OpenApi.Models;
using Serilog;
using StockManager.Middlewares;

namespace StockManager.Extensions
{
    public static class WebApplicationBuilderExtensions
    {
        public static void AddPresentation(this WebApplicationBuilder builder)
        {
            // configure JWT token
            builder.Services.AddAuthentication();

            builder.Services.AddControllers();
            builder.Services.AddScoped<ErrorHandlingMiddleware>();

            //serilog
            builder.Host.UseSerilog((context, configuration) =>
                 configuration.ReadFrom.Configuration(context.Configuration)
            );

            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                     {
                         new OpenApiSecurityScheme
                         {
                               Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "bearerAuth" }
                         },
                        []
                     }
                });
            });

        }
    }
}
