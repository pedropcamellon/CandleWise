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

        public StockController(AlpacaMarketDataService alpacaService, ILogger<StockController> logger)
        {
            _alpacaService = alpacaService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Stock>>> Get()
        {
            try
            {
                _logger.LogInformation("Fetching all stocks with real-time prices");

                // Define the stocks we want to track
                var stockSymbols = new[] { "AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META" };
                var companyNames = new Dictionary<string, string>
                {
                    { "AAPL", "Apple Inc." },
                    { "GOOGL", "Alphabet Inc." },
                    { "MSFT", "Microsoft Corporation" },
                    { "TSLA", "Tesla Inc." },
                    { "AMZN", "Amazon.com Inc." },
                    { "NVDA", "NVIDIA Corporation" },
                    { "META", "Meta Platforms Inc." }
                };

                // Fetch all prices in batch for better performance
                var prices = await _alpacaService.GetLatestPricesAsync(stockSymbols);

                var stocks = new List<Stock>();
                int id = 1;

                foreach (var symbol in stockSymbols)
                {
                    if (prices.TryGetValue(symbol, out var price))
                    {
                        stocks.Add(new Stock
                        {
                            Id = id++,
                            Symbol = symbol,
                            CompanyName = companyNames[symbol],
                            Price = price
                        });
                    }
                    else
                    {
                        _logger.LogWarning("No price data available for symbol: {Symbol}", symbol);
                        // Add with zero price if no data available
                        stocks.Add(new Stock
                        {
                            Id = id++,
                            Symbol = symbol,
                            CompanyName = companyNames[symbol],
                            Price = 0
                        });
                    }
                }

                _logger.LogInformation("Successfully fetched {Count} stocks", stocks.Count);
                return Ok(stocks);
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("Alpaca API credentials"))
            {
                _logger.LogError(ex, "Alpaca API credentials are missing");
                return BadRequest(new { error = "API_CREDENTIALS_MISSING", message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching stocks");
                return StatusCode(500, new { error = "INTERNAL_ERROR", message = "An error occurred while fetching stock data" });
            }
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
    }
}
