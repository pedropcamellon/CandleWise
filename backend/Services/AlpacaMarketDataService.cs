using System.Text.Json;
using System.Text.Json.Serialization;

namespace CandleWise.Services
{
    public class AlpacaMarketDataService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AlpacaMarketDataService> _logger;

        public AlpacaMarketDataService(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<AlpacaMarketDataService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;

            // Configure HTTP client with Alpaca credentials
            var apiKeyId = _configuration["Alpaca:ApiKeyId"];
            var apiSecretKey = _configuration["Alpaca:ApiSecretKey"];

            if (string.IsNullOrEmpty(apiKeyId) || string.IsNullOrEmpty(apiSecretKey))
            {
                throw new InvalidOperationException(
                    "Alpaca API credentials are missing. Please configure 'Alpaca:ApiKeyId' and 'Alpaca:ApiSecretKey' in your application settings.");
            }

            _httpClient.DefaultRequestHeaders.Add("APCA-API-KEY-ID", apiKeyId);
            _httpClient.DefaultRequestHeaders.Add("APCA-API-SECRET-KEY", apiSecretKey);

            _httpClient.BaseAddress = new Uri(_configuration["Alpaca:BaseUrl"] ?? "https://data.alpaca.markets");
        }

        public async Task<decimal> GetLatestPriceAsync(string symbol)
        {
            try
            {
                _logger.LogInformation("Fetching latest price for symbol: {Symbol}", symbol);

                // Use the latest quotes endpoint for real-time data
                var response = await _httpClient.GetStringAsync($"/v2/stocks/quotes/latest?symbols={symbol}&feed=iex");

                var quoteData = JsonSerializer.Deserialize<LatestQuoteResponse>(response);

                if (quoteData?.Quotes?.ContainsKey(symbol) == true)
                {
                    var quote = quoteData.Quotes[symbol];
                    // Use the mid-point between bid and ask as the current price
                    var currentPrice = (quote.BidPrice + quote.AskPrice) / 2;

                    _logger.LogInformation("Successfully fetched price for {Symbol}: ${Price:F2}", symbol, currentPrice);
                    return currentPrice;
                }

                _logger.LogWarning("No quote data found for symbol: {Symbol}", symbol);
                return 0;
            }
            catch (HttpRequestException httpEx)
            {
                _logger.LogError(httpEx, "HTTP error while fetching price for symbol: {Symbol}", symbol);
                return 0;
            }
            catch (TaskCanceledException tcEx)
            {
                _logger.LogError(tcEx, "Request timeout while fetching price for symbol: {Symbol}", symbol);
                return 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while fetching price for symbol: {Symbol}", symbol);
                return 0;
            }
        }

        public async Task<Dictionary<string, decimal>> GetLatestPricesAsync(string[] symbols)
        {
            try
            {
                _logger.LogInformation("Fetching latest prices for {Count} symbols", symbols.Length);

                var symbolString = string.Join(",", symbols);
                var response = await _httpClient.GetStringAsync($"/v2/stocks/quotes/latest?symbols={symbolString}&feed=iex");

                var quoteData = JsonSerializer.Deserialize<LatestQuoteResponse>(response);
                var prices = new Dictionary<string, decimal>();

                if (quoteData?.Quotes != null)
                {
                    foreach (var kvp in quoteData.Quotes)
                    {
                        var symbol = kvp.Key;
                        var quote = kvp.Value;
                        // Use the mid-point between bid and ask as the current price
                        prices[symbol] = (quote.BidPrice + quote.AskPrice) / 2;
                    }
                }

                _logger.LogInformation("Successfully fetched prices for {Count} symbols", prices.Count);
                return prices;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching multiple prices");
                return new Dictionary<string, decimal>();
            }
        }

        public async Task<List<HistoricalBar>> GetHistoricalDataAsync(string symbol, int days = 30)
        {
            try
            {
                _logger.LogInformation("Fetching historical data for symbol: {Symbol}, days: {Days}", symbol, days);

                var endDate = DateTime.UtcNow.Date;
                var startDate = endDate.AddDays(-days);

                var startDateString = startDate.ToString("yyyy-MM-dd");
                var endDateString = endDate.ToString("yyyy-MM-dd");

                var response = await _httpClient.GetStringAsync(
                    $"/v2/stocks/bars?symbols={symbol}&timeframe=1Day&start={startDateString}&end={endDateString}&limit=1000&adjustment=raw&feed=iex&sort=asc");

                var barData = JsonSerializer.Deserialize<HistoricalBarsResponse>(response);

                if (barData?.Bars?.ContainsKey(symbol) == true)
                {
                    var bars = barData.Bars[symbol].Select(bar => new HistoricalBar
                    {
                        Timestamp = bar.Timestamp,
                        Open = bar.OpenPrice,
                        High = bar.HighPrice,
                        Low = bar.LowPrice,
                        Close = bar.ClosingPrice,
                        Volume = bar.Volume
                    }).ToList();

                    _logger.LogInformation("Successfully fetched {Count} historical bars for {Symbol}", bars.Count, symbol);
                    return bars;
                }

                _logger.LogWarning("No historical data found for symbol: {Symbol}", symbol);
                return new List<HistoricalBar>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching historical data for symbol: {Symbol}", symbol);
                return new List<HistoricalBar>();
            }
        }
    }

    // Response models for Alpaca API
    public class LatestQuoteResponse
    {
        [JsonPropertyName("quotes")]
        public Dictionary<string, Quote> Quotes { get; set; } = new();
    }

    public class Quote
    {
        [JsonPropertyName("ap")]
        public decimal AskPrice { get; set; }

        [JsonPropertyName("bp")]
        public decimal BidPrice { get; set; }

        [JsonPropertyName("as")]
        public int AskSize { get; set; }

        [JsonPropertyName("bs")]
        public int BidSize { get; set; }

        [JsonPropertyName("t")]
        public DateTimeOffset Timestamp { get; set; }
    }

    public class HistoricalBarsResponse
    {
        [JsonPropertyName("bars")]
        public Dictionary<string, List<StockBar>> Bars { get; set; } = new();
    }

    public class StockBar
    {
        [JsonPropertyName("c")]
        public decimal ClosingPrice { get; set; }

        [JsonPropertyName("h")]
        public decimal HighPrice { get; set; }

        [JsonPropertyName("l")]
        public decimal LowPrice { get; set; }

        [JsonPropertyName("o")]
        public decimal OpenPrice { get; set; }

        [JsonPropertyName("t")]
        public DateTimeOffset Timestamp { get; set; }

        [JsonPropertyName("v")]
        public long Volume { get; set; }

        [JsonPropertyName("vw")]
        public decimal VolumeWeightedAverage { get; set; }
    }

    public class HistoricalBar
    {
        public DateTimeOffset Timestamp { get; set; }
        public decimal Open { get; set; }
        public decimal High { get; set; }
        public decimal Low { get; set; }
        public decimal Close { get; set; }
        public long Volume { get; set; }
    }
}
