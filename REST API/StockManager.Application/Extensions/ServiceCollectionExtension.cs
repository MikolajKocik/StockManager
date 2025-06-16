using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StockManager.Application.Services.Auth;
using StockManager.Core.Domain.Interfaces.Services;


namespace StockManager.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddApplication(this IServiceCollection services, IConfiguration configuration)
        {
            var applicationAssembly = typeof(ServiceCollectionExtensions).Assembly;

            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(applicationAssembly));

            services.AddAutoMapper(applicationAssembly);

            services.AddValidatorsFromAssembly(applicationAssembly)
                .AddFluentValidationAutoValidation();

            services.AddHttpContextAccessor();

            services.AddScoped<IAuthService, AuthService>();
        }
    }
}
