﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using StockManager.Application.Helpers.NullConfiguration;
using StockManager.Middlewares;
using System.Text;
using System.Text.Json.Serialization;

namespace StockManager.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static void AddPresentation(this WebApplicationBuilder builder)
    {
        byte[] key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT__Key")!);

        string? issuer = Environment.GetEnvironmentVariable("JWT__Issuer")!;

        string? audience = Environment.GetEnvironmentVariable("JWT__Audience")!;

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

        builder.Services
            .AddControllers()
            .AddJsonOptions(opts =>
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

        builder.Services.AddScoped<ErrorHandlingMiddleware>();

        //serilog
        builder.Host.UseSerilog((context, configuration) =>
             configuration.ReadFrom.Configuration(context.Configuration)
        );

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
