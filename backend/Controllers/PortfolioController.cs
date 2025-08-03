using CandleWise.Models;
using Microsoft.AspNetCore.Mvc;

namespace CandleWise.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly ILogger<PortfolioController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public PortfolioController(ILogger<PortfolioController> logger, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        // ============== DEFAULT PORTFOLIO ENDPOINTS ==============
        // These provide sample data for development, will be enhanced with real database operations

        [HttpGet("default")]
        public IActionResult GetDefaultPortfolio()
        {
            try
            {
                var defaultPortfolio = new Portfolio
                {
                    Id = "portfolio-1",
                    UserId = "user-1",
                    Name = "My Investment Portfolio",
                    Description = "Long-term growth focused portfolio",
                    TotalValue = 12750.00m,
                    TotalGainLoss = 1250.00m,
                    TotalGainLossPercent = 10.87m,
                    CreatedAt = DateTime.Parse("2024-01-15"),
                    UpdatedAt = DateTime.UtcNow,
                    Holdings = new List<PortfolioHolding>
                    {
                        new PortfolioHolding
                        {
                            Id = "holding-1",
                            PortfolioId = "portfolio-1",
                            Symbol = "AAPL",
                            Shares = 50,
                            AverageCostBasis = 180.00m,
                            CreatedAt = DateTime.Parse("2024-01-15"),
                            UpdatedAt = DateTime.UtcNow,
                        },
                        new PortfolioHolding
                        {
                            Id = "holding-2",
                            PortfolioId = "portfolio-1",
                            Symbol = "GOOGL",
                            Shares = 10,
                            AverageCostBasis = 250.00m,
                            CreatedAt = DateTime.Parse("2024-02-01"),
                            UpdatedAt = DateTime.UtcNow,
                        },
                    }
                };

                // Add summary data directly to the portfolio object
                // Map holdings to simplified structure with allocation calculation
                var holdingsWithMarketValue = defaultPortfolio.Holdings.Select(h => new
                {
                    Holding = h,
                    MarketValue = h.Symbol == "AAPL" ? h.Shares * 195.00m :
                                 h.Symbol == "GOOGL" ? h.Shares * 300.00m : h.Shares * h.AverageCostBasis
                }).ToList();

                var totalMarketValue = holdingsWithMarketValue.Sum(h => h.MarketValue);

                var simplifiedHoldings = holdingsWithMarketValue.Select(item =>
                {
                    var allocationPercent = totalMarketValue > 0 ? (item.MarketValue / totalMarketValue) * 100 : 0;

                    return new
                    {
                        Id = item.Holding.Id,
                        PortfolioId = item.Holding.PortfolioId,
                        Symbol = item.Holding.Symbol,
                        Shares = item.Holding.Shares,
                        AverageCostBasis = item.Holding.AverageCostBasis,
                        AllocationPercent = allocationPercent,
                        CreatedAt = item.Holding.CreatedAt,
                        UpdatedAt = item.Holding.UpdatedAt
                    };
                }).ToList();

                var portfolioData = new
                {
                    Id = defaultPortfolio.Id,
                    UserId = defaultPortfolio.UserId,
                    Name = defaultPortfolio.Name,
                    Description = defaultPortfolio.Description,
                    TotalValue = totalMarketValue,
                    TotalCost = 11500.00m,
                    TotalGainLoss = totalMarketValue - 11500.00m,
                    TotalGainLossPercent = ((totalMarketValue - 11500.00m) / 11500.00m) * 100,
                    DayChange = 125.50m,
                    DayChangePercent = 0.99m,
                    TopPerformer = new { Symbol = "GOOGL", GainLossPercent = 20.00m },
                    TopLoser = (object?)null,
                    CreatedAt = defaultPortfolio.CreatedAt,
                    UpdatedAt = defaultPortfolio.UpdatedAt,
                    Holdings = simplifiedHoldings
                };

                return Ok(portfolioData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching default portfolio");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("default/allocation")]
        public IActionResult GetDefaultPortfolioAllocation()
        {
            try
            {
                var allocation = new List<AllocationBreakdownDto>
                {
                    new AllocationBreakdownDto
                    {
                        Symbol = "AAPL",
                        CompanyName = "Apple Inc.",
                        AllocationPercent = 76.47m,
                        MarketValue = 9750.00m,
                    },
                    new AllocationBreakdownDto
                    {
                        Symbol = "GOOGL",
                        CompanyName = "Alphabet Inc.",
                        AllocationPercent = 23.53m,
                        MarketValue = 3000.00m,
                    },
                };

                return Ok(allocation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching allocation breakdown");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // ============== FUTURE ENDPOINTS (Database-backed) ==============
        // These will be implemented when database is added

        // GET /api/portfolio/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPortfolios(string userId)
        {
            // TODO: Implement with database
            return Ok(new { data = new List<Portfolio>(), success = true, message = "Database not implemented yet" });
        }

        // GET /api/portfolio/{portfolioId}
        [HttpGet("{portfolioId}")]
        public async Task<IActionResult> GetPortfolioById(string portfolioId)
        {
            // TODO: Implement with database
            return NotFound(new { success = false, message = "Database not implemented yet" });
        }

        // POST /api/portfolio
        [HttpPost]
        public async Task<IActionResult> CreatePortfolio([FromBody] CreatePortfolioDto request)
        {
            // TODO: Implement with database
            return Ok(new { data = new Portfolio(), success = true, message = "Database not implemented yet" });
        }

        // PUT /api/portfolio/{portfolioId}
        [HttpPut("{portfolioId}")]
        public async Task<IActionResult> UpdatePortfolio(string portfolioId, [FromBody] UpdatePortfolioDto request)
        {
            // TODO: Implement with database
            return Ok(new { data = new Portfolio(), success = true, message = "Database not implemented yet" });
        }

        // DELETE /api/portfolio/{portfolioId}
        [HttpDelete("{portfolioId}")]
        public async Task<IActionResult> DeletePortfolio(string portfolioId)
        {
            // TODO: Implement with database
            return Ok(new { success = true, message = "Database not implemented yet" });
        }

        // POST /api/portfolio/{portfolioId}/holdings
        [HttpPost("{portfolioId}/holdings")]
        public async Task<IActionResult> AddHolding(string portfolioId, [FromBody] AddHoldingDto request)
        {
            // TODO: Implement with database
            return Ok(new { data = new PortfolioHolding(), success = true, message = "Database not implemented yet" });
        }

        // PUT /api/portfolio/{portfolioId}/holdings/{holdingId}
        [HttpPut("{portfolioId}/holdings/{holdingId}")]
        public async Task<IActionResult> UpdateHolding(string portfolioId, string holdingId, [FromBody] UpdateHoldingDto request)
        {
            // TODO: Implement with database
            return Ok(new { data = new PortfolioHolding(), success = true, message = "Database not implemented yet" });
        }

        // DELETE /api/portfolio/{portfolioId}/holdings/{holdingId}
        [HttpDelete("{portfolioId}/holdings/{holdingId}")]
        public async Task<IActionResult> RemoveHolding(string portfolioId, string holdingId)
        {
            // TODO: Implement with database
            return Ok(new { success = true, message = "Database not implemented yet" });
        }

        // POST /api/portfolio/{portfolioId}/transactions
        [HttpPost("{portfolioId}/transactions")]
        public async Task<IActionResult> AddTransaction(string portfolioId, [FromBody] AddTransactionDto request)
        {
            // TODO: Implement with database
            return Ok(new { data = new Transaction(), success = true, message = "Database not implemented yet" });
        }

        // GET /api/portfolio/{portfolioId}/transactions
        [HttpGet("{portfolioId}/transactions")]
        public async Task<IActionResult> GetTransactionHistory(string portfolioId)
        {
            // TODO: Implement with database
            return Ok(new { data = new List<Transaction>(), success = true, message = "Database not implemented yet" });
        }

        // GET /api/portfolio/{portfolioId}/summary
        [HttpGet("{portfolioId}/summary")]
        public async Task<IActionResult> GetPortfolioSummary(string portfolioId)
        {
            // TODO: Implement with database
            return Ok(new { data = new PortfolioSummaryDto(), success = true, message = "Database not implemented yet" });
        }

        // GET /api/portfolio/{portfolioId}/allocation
        [HttpGet("{portfolioId}/allocation")]
        public async Task<IActionResult> GetAllocationBreakdown(string portfolioId)
        {
            // TODO: Implement with database
            return Ok(new { data = new List<AllocationBreakdownDto>(), success = true, message = "Database not implemented yet" });
        }
    }
}
