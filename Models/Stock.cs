namespace CandleWise.Models
{
    public class Stock
    {
        //public Stock(string name, float priceNow)
        //{
        //    Name = name;
        //    PriceNow = priceNow;
        //}

        public long Id { get; set; }

        public string Symbol { get; set; } = string.Empty;

        public string CompanyName { get; set; } = string.Empty;

        public decimal Price { get; set; } = 0;

        //public float PriceOpen { get; set; } = 0;

        //public float PriceClose { get; set; } = 0;

        //public float PriceHigh { get; set; } = 0;

        //public float PriceLow { get; set; } = 0;
    }
}
