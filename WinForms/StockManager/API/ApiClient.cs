using System.Configuration;

namespace StockManager.API
{
    public abstract class ApiClient 
    {
        protected private readonly HttpClient _httpClient;
        protected private readonly string _apiBaseUrl;
        public ApiClient(HttpClient httpClient) 
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _apiBaseUrl = ConfigurationManager.AppSettings["StockManagerAPI:BaseUrl"] ??
                throw new Exception("BaseUrl is missing in config.");
        }
    }
}
