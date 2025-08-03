using CandleWise.Models;
using CandleWise.Services;
using Microsoft.AspNetCore.Mvc;

namespace CandleWise.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly AlpacaMarketDataService _alpacaService;
        private readonly ILogger<StockController> _logger;

        // Static mapping of symbols to company names
        private static readonly Dictionary<string, string> _companyNames = new()
        {
            { "AAPL", "Apple Inc." },
            { "GOOGL", "Alphabet Inc." },
            { "MSFT", "Microsoft Corporation" },
            { "AMZN", "Amazon.com Inc." },
            { "TSLA", "Tesla Inc." },
            { "META", "Meta Platforms Inc." },
            { "NVDA", "NVIDIA Corporation" },
            { "NFLX", "Netflix Inc." },
            { "PYPL", "PayPal Holdings Inc." },
            { "ADBE", "Adobe Inc." }
        };

        public StockController(AlpacaMarketDataService alpacaService, ILogger<StockController> logger)
        {
            _alpacaService = alpacaService;
            _logger = logger;
        }


        [HttpGet("{symbol}/price")]
        public async Task<ActionResult<decimal>> GetStockPrice(string symbol)
        {
            try
            {
                _logger.LogInformation("Fetching price for symbol: {Symbol}", symbol);

                var price = await _alpacaService.GetLatestPriceAsync(symbol.ToUpper());

                if (price <= 0)
                {
                    return NotFound($"No price data available for symbol: {symbol}");
                }

                return Ok(new { symbol, price });
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("Alpaca API credentials"))
            {
                _logger.LogError(ex, "Alpaca API credentials are missing for symbol: {Symbol}", symbol);
                return BadRequest(new { error = "API_CREDENTIALS_MISSING", message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching price for symbol: {Symbol}", symbol);
                return StatusCode(500, new { error = "INTERNAL_ERROR", message = "An error occurred while fetching stock price" });
            }
        }

        [HttpPost("prices")]
        public async Task<ActionResult> GetMultipleStockPrices([FromBody] StockPricesRequest request)
        {
            try
            {
                if (request?.Symbols == null || !request.Symbols.Any())
                {
                    return BadRequest(new { error = "INVALID_REQUEST", message = "Symbols list is required and cannot be empty" });
                }

                _logger.LogInformation("Fetching prices for {Count} symbols: {Symbols}", request.Symbols.Count, string.Join(", ", request.Symbols));

                // Convert to uppercase for consistency
                var symbolsArray = request.Symbols.Select(s => s.ToUpper()).ToArray();

                // Fetch all prices in batch for better performance
                var prices = await _alpacaService.GetLatestPricesAsync(symbolsArray);

                // Build response with prices and any missing symbols
                var response = new StockPricesResponse
                {
                    Prices = new Dictionary<string, StockPriceInfo>(),
                    MissingSymbols = new List<string>(),
                    Timestamp = DateTime.UtcNow
                };

                foreach (var symbol in symbolsArray)
                {
                    if (prices.TryGetValue(symbol, out var price) && price > 0)
                    {
                        response.Prices[symbol] = new StockPriceInfo
                        {
                            Symbol = symbol,
                            Price = price,
                            CompanyName = _companyNames.TryGetValue(symbol, out var companyName) ? companyName : symbol
                        };
                    }
                    else
                    {
                        response.MissingSymbols.Add(symbol);
                        _logger.LogWarning("No price data available for symbol: {Symbol}", symbol);
                    }
                }

                _logger.LogInformation("Successfully fetched prices for {Count}/{Total} symbols",
                    response.Prices.Count, symbolsArray.Length);

                return Ok(new { data = response, success = true });
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("Alpaca API credentials"))
            {
                _logger.LogError(ex, "Alpaca API credentials are missing");
                return BadRequest(new { error = "API_CREDENTIALS_MISSING", message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching multiple stock prices");
                return StatusCode(500, new { error = "INTERNAL_ERROR", message = "An error occurred while fetching stock prices" });
            }
        }
    }

    // Request/Response DTOs for batch price endpoint
    public class StockPricesRequest
    {
        public List<string> Symbols { get; set; } = new List<string>();
    }

    public class StockPricesResponse
    {
        public Dictionary<string, StockPriceInfo> Prices { get; set; } = new Dictionary<string, StockPriceInfo>();
        public List<string> MissingSymbols { get; set; } = new List<string>();
        public DateTime Timestamp { get; set; }
    }

    public class StockPriceInfo
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string CompanyName { get; set; } = string.Empty;
    }
}
