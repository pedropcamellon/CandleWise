using CandleWise.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace CandleWise.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public StockController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();

            // Add the API key to the default headers
            _httpClient.DefaultRequestHeaders.Add("APCA-API-KEY-ID", "PKJ14TYE8C3WDPLMNILZ");

            _httpClient.DefaultRequestHeaders.Add("APCA-API-SECRET-KEY", "j0VjklhAWg8hRKT6q5S8iHox8xgUd09OT9ZmVUfP");
        }

        [HttpGet]
        public async Task<IEnumerable<Stock>> Get()
        {
            var stocks = new List<Stock>
                {
                    new Stock { Symbol = "AAPL", CompanyName = "Apple Inc.", Price = await GetStockPriceAsync("AAPL") },
                    new Stock { Symbol = "GOOGL", CompanyName = "Google", Price = await GetStockPriceAsync("GOOGL") },
                };

            return stocks;
        }

        private async Task<decimal> GetStockPriceAsync(string stockSymbol)
        {
            try
            {
                // Calculate the start and end dates
                DateTime endDate = DateTime.Now.Date.AddDays(-1); // Yesterday
                DateTime startDate = endDate.AddDays(-2); // Two days back

                // Format the dates as strings in the required format (YYYY-MM-DD)
                string startDateString = startDate.ToString("yyyy-MM-dd");
                string endDateString = endDate.ToString("yyyy-MM-dd");

                // Construct the API URL with the calculated date range
                // For simplicity, using a free API for demonstration purposes.
                string apiUrl = $"https://data.alpaca.markets/v2/stocks/bars?symbols={stockSymbol}&timeframe=1H&start={startDateString}&end={endDateString}&limit=1000&adjustment=raw&feed=sip&sort=asc";

                string apiResponse = await _httpClient.GetStringAsync(apiUrl);

                if (apiResponse == null) { return 0; }

                // Parse the JSON response
                var responseData = JsonSerializer.Deserialize<StockApiResponse>(apiResponse);

                if (responseData == null || responseData.Bars == null) { return 0; }

                // Check if the bars for the specified symbol exist
                if (!responseData.Bars.ContainsKey(stockSymbol)) { return 0; }

                // Assuming you are interested in the most recent closing price
                var latestBar = responseData.Bars[stockSymbol].LastOrDefault();

                if (latestBar == null) { return 0; }

                return latestBar.ClosingPrice;
            }
            catch (Exception ex)
            {
                // Handle exceptions appropriately (log, notify, etc.)
                Console.WriteLine($"An error occurred: {ex.Message}");
                return 0;
            }
        }

        /*
         "bars": {
    "AAPL": [
      {
        "c": 180.87,
        "h": 180.89,
        "l": 180.87,
        "n": 10,
        "o": 180.89,
        "t": "2024-01-06T00:00:00Z",
        "v": 325,
        "vw": 180.877354
      },
         */
        // Define classes to represent the structure of the JSON response
        public class StockApiResponse
        {
            [JsonPropertyName("bars")]
            public Dictionary<string, IList<StockBar>>? Bars { get; set; }

            [JsonPropertyName("next_page_token")]
            public string? NextPageToken { get; set; }
        }

        public class StockBar
        {
            [JsonPropertyName("c")]
            public decimal ClosingPrice { get; set; }

            [JsonPropertyName("h")]
            public decimal HighPrice { get; set; }

            [JsonPropertyName("l")]
            public decimal LowPrice { get; set; }

            [JsonPropertyName("n")]
            public decimal N { get; set; }

            [JsonPropertyName("o")]
            public decimal OpenPrice { get; set; }

            [JsonPropertyName("t")]
            public DateTimeOffset Timestamp { get; set; }

            [JsonPropertyName("v")]
            public int Volume { get; set; }

            [JsonPropertyName("vw")]
            public decimal VolumeWeightedAverage { get; set; }
        }
    }
}
