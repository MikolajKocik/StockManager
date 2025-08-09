using Azure.Identity;

namespace StockManager.Extensions.WebAppBuilderExtensions.Azure;

public static class AzureKeyVault
{
    public static void AzureConfigure(this WebApplicationBuilder builder)
    {
        string? kvUri = Environment.GetEnvironmentVariable("KEYVAULT_URI")
            ?? throw new ArgumentException(nameof(kvUri));
        ;

        if(!string.IsNullOrWhiteSpace(kvUri))
        {
            builder.Configuration.AddAzureKeyVault(
                new Uri(kvUri), new DefaultAzureCredential());
        }
    }
}
