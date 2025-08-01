namespace CandleWise.Models
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public List<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
    }

    public class Portfolio
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal TotalValue { get; set; }
        public decimal TotalGainLoss { get; set; }
        public decimal TotalGainLossPercent { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public User? User { get; set; }
        public List<PortfolioHolding> Holdings { get; set; } = new List<PortfolioHolding>();
        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
    }

    public class PortfolioHolding
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string PortfolioId { get; set; } = string.Empty;
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public decimal Shares { get; set; }
        public decimal AverageCostBasis { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal MarketValue { get; set; }
        public decimal TotalCost { get; set; }
        public decimal GainLoss { get; set; }
        public decimal GainLossPercent { get; set; }
        public decimal AllocationPercent { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Portfolio? Portfolio { get; set; }
    }

    public class Transaction
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string PortfolioId { get; set; } = string.Empty;
        public string Symbol { get; set; } = string.Empty;
        public TransactionType Type { get; set; }
        public decimal Shares { get; set; }
        public decimal PricePerShare { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
        
        // Navigation properties
        public Portfolio? Portfolio { get; set; }
    }

    public enum TransactionType
    {
        BUY,
        SELL
    }

    // DTOs for API responses
    public class PortfolioSummaryDto
    {
        public decimal TotalValue { get; set; }
        public decimal TotalCost { get; set; }
        public decimal TotalGainLoss { get; set; }
        public decimal TotalGainLossPercent { get; set; }
        public decimal DayChange { get; set; }
        public decimal DayChangePercent { get; set; }
        public TopPerformerDto? TopPerformer { get; set; }
        public TopPerformerDto? TopLoser { get; set; }
    }

    public class TopPerformerDto
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal GainLossPercent { get; set; }
    }

    public class AllocationBreakdownDto
    {
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public decimal AllocationPercent { get; set; }
        public decimal MarketValue { get; set; }
    }

    // Request DTOs
    public class CreatePortfolioDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class UpdatePortfolioDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    public class AddHoldingDto
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal Shares { get; set; }
        public decimal CostBasis { get; set; }
    }

    public class UpdateHoldingDto
    {
        public decimal? Shares { get; set; }
        public decimal? AverageCostBasis { get; set; }
    }

    public class AddTransactionDto
    {
        public string Symbol { get; set; } = string.Empty;
        public TransactionType Type { get; set; }
        public decimal Shares { get; set; }
        public decimal PricePerShare { get; set; }
        public string? Notes { get; set; }
    }
}
