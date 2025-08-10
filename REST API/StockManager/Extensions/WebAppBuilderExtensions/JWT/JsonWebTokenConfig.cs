using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StockManager.Application.Helpers.NullConfiguration;

namespace StockManager.Extensions.WebAppBuilderExtensions.JWT;

internal static class JsonWebTokenConfig
{
    public static void AddJWT(WebApplicationBuilder builder)
    {
        byte[] key = Encoding.UTF8.GetBytes(builder.Configuration["jwt-key"]!);

        string? issuer = builder.Configuration["jwt-issuer"]!;

        string? audience = builder.Configuration["jwt-audience"]!;

        NullCheck.IsConfigured(key, issuer, audience);

        // configure JWT token
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = issuer,

                ValidateAudience = true,
                ValidAudience = audience,

                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });
    }
}
