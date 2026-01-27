using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

namespace StockManager.Extensions.WebAppBuilderExtensions.Azure;

public static class AzureKeyVault
{
    public static void AzureConfigure(this WebApplicationBuilder builder)
    {
        string? kvUri = Environment.GetEnvironmentVariable("KEYVAULT_URI");

        if(!string.IsNullOrWhiteSpace(kvUri) && !builder.Environment.IsDevelopment())
        {
            builder.Configuration.AddAzureKeyVault(new Uri(kvUri), new DefaultAzureCredential());
        }
    }
}
