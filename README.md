# CandleWise Portfolio Management

**A modern, real-time stock portfolio management application built with ASP.NET Core and Next.js**

## 🎯 Overview

CandleWise has evolved from a simple stock price tracker into a comprehensive **Portfolio Management System** that helps users track their investments, monitor performance, and manage their stock portfolios with real-time market data.

## ✨ Key Features

### 📈 Portfolio Management

- **Real-time Portfolio Tracking** - Monitor your investments with live stock prices
- **Holdings Management** - Add, edit, and remove stocks from your portfolio  
- **Performance Analytics** - Track gains/losses, allocation percentages, and portfolio growth
- **Net Worth Dashboard** - Get a quick overview of your total portfolio value

### 💰 Financial Insights

- **Live Market Data** - Real-time stock prices from Alpaca Markets API
- **Gain/Loss Calculations** - Automatic calculation of performance metrics
- **Portfolio Allocation** - Visual breakdown of your investment distribution
- **Transaction History** - Keep track of all your buy/sell activities

## 🏗️ Architecture

```
CandleWise/
├── 🔧 backend/          # ASP.NET Core 6 Web API
├── 🎨 frontend/         # Next.js 14 with TypeScript
├── 📝 shared/           # Shared TypeScript definitions
├── 🐳 docker-compose.yml
└── 📚 scripts/          # Development helpers
```

## 🚀 Quick Start

### Prerequisites

- **.NET 6.0 SDK**
- **Node.js 18+**
- **Docker** (optional)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/pedropcamellon/CandleWise.git
   cd CandleWise
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your Alpaca API credentials
   ```

4. **Start development servers**

   ```bash
   npm run dev
   ```

   This will start:
   - **Backend**: <http://localhost:5000> (API + Swagger)
   - **Frontend**: <http://localhost:3000>

### Using PowerShell Scripts

```powershell
# Start development environment
.\scripts\dev.ps1

# Build all applications
.\scripts\build.ps1

# Docker management
.\scripts\docker.ps1 up    # Start containers
.\scripts\docker.ps1 down  # Stop containers
```

### Using Docker

```bash
# Start the entire stack
npm run docker:up

# Stop the stack
npm run docker:down
```

## 🎯 Features

### Backend (ASP.NET Core 6)

- ✅ RESTful Web API
- ✅ Real-time stock data from Alpaca Markets
- ✅ HttpClientFactory for efficient HTTP calls
- ✅ Swagger/OpenAPI documentation
- ✅ CORS configuration for frontend
- ✅ Docker containerization

### Frontend (Next.js 14)

- ✅ Modern React with TypeScript
- ✅ Tailwind CSS for styling
- ✅ Real-time stock price dashboard
- ✅ Responsive design
- ✅ API integration with backend
- ✅ Docker containerization

### Shared

- ✅ TypeScript type definitions
- ✅ Consistent data models
- ✅ Monorepo structure

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stock` | Get all stocks with current prices |
| GET | `/api/stock/{symbol}/price` | Get current price for specific stock |

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend |
| `npm run dev:backend` | Start only backend |
| `npm run dev:frontend` | Start only frontend |
| `npm run build` | Build both applications |
| `npm run test` | Run all tests |
| `npm run docker:up` | Start Docker stack |
| `npm run docker:down` | Stop Docker stack |

## 📱 Stock Dashboard

The frontend features a responsive stock dashboard that:

- 📈 Displays real-time stock prices
- 🔄 Allows manual price refresh
- 🎨 Clean, modern UI with Tailwind CSS
- 📱 Mobile-responsive design

## 🔌 API Integration

The system integrates with **Alpaca Markets API** to fetch real-time stock data:

- Real-time price updates
- Historical data support
- Professional trading data
- Secure API key management

## 🐳 Docker Support

Complete containerization with:

- **Multi-stage builds** for optimization
- **Development** and **production** configurations
- **Docker Compose** for orchestration
- **Hot reloading** in development

## 🔒 Security Considerations

- API keys stored in environment variables
- CORS properly configured
- No sensitive data in client-side code
- Docker security best practices

## 🚀 Deployment

### Production Deployment

1. Set production environment variables
2. Build the applications: `npm run build`
3. Deploy using Docker: `docker-compose up -d`

### Azure Deployment

- Backend: Azure App Service
- Frontend: Azure Static Web Apps or App Service
- Container Registry: Azure Container Registry

# 🚀 Alpaca Market Data API Integration Guide

## Overview

CandleWise now uses the Alpaca Market Data API to provide real-time and historical stock prices. This integration replaces mock data with live market information.

## 📋 Quick Setup

### 1. Get Your Alpaca API Keys

1. Visit [Alpaca Markets](https://alpaca.markets/) and create a free account
2. Navigate to the API section in your dashboard
3. Generate your API Key ID and Secret Key

### 2. Configure Your Environment

#### Backend Configuration (backend/.env.local or backend/appsettings.json)

For development, create `backend/.env.local`:

```bash
# Alpaca Market Data API Configuration
ALPACA__APIKEYID=YOUR_API_KEY_ID  
ALPACA__APISECRETKEY=YOUR_API_SECRET_KEY
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://localhost:5245
```

Or add to `backend/appsettings.Development.json`:

```json
{
  "Alpaca": {
    "BaseUrl": "https://data.alpaca.markets",
    "ApiKeyId": "YOUR_API_KEY_ID",
    "ApiSecretKey": "YOUR_API_SECRET_KEY"
  }
}
```

#### Frontend Configuration (frontend/.env.local)

```bash
NEXT_PUBLIC_API_URL=/api
DOTNET_API_URL=http://localhost:5245/api
NODE_ENV=development
```

## 🔧 Architecture

### Backend Components

#### AlpacaMarketDataService.cs

- **Purpose**: Secure HTTP client service for Alpaca API calls
- **Features**:
  - Real-time quote fetching
  - Batch price requests for performance
  - Historical data retrieval
  - Comprehensive error handling and logging
  - Rate limiting protection

#### Updated StockController.cs

- **Endpoints**:
  - `GET /api/stock` - Fetches all tracked stocks with live prices
  - `GET /api/stock/{symbol}/price` - Single stock price lookup
  - `GET /api/stock/{symbol}/historical` - Historical price data

### Frontend Components

#### PortfolioDashboard.tsx

- **Features**:
  - Real-time portfolio tracking with live price updates
  - Individual holding cards with optimized state management
  - Visual price direction indicators (↗↘)
  - Automatic 30-second price refresh for each holding
  - Flash effects for price changes with ring animations
  - Manual refresh buttons with loading states
  - Performance calculations and gain/loss tracking
  - Interactive stock charts with historical data
  - Memoized components to prevent unnecessary re-renders
  - Efficient useCallback hooks for optimized performance
  - Background price updates without blocking UI
  - Comprehensive error handling for API credentials

## 📊 Alpaca API Features Used

### Real-time Data

- **Source**: IEX Exchange (Free tier)
- **Update Frequency**: Every 5 seconds
- **Data Points**: Bid/Ask prices, timestamps

### Historical Data

- **Timeframes**: Daily bars
- **Range**: Since 2016
- **Usage**: Chart visualization and trend analysis

## 🚦 Rate Limits & Best Practices

### Free Tier Limitations

- **API Calls**: 200 per minute
- **Websocket Subscriptions**: 30 symbols
- **Real-time Coverage**: IEX exchange only
- **Historical Access**: Last 15 minutes delay

### Optimization Strategies

1. **Batch Requests**: Fetch multiple stock prices in single API call
2. **Caching**: Background updates preserve existing data on errors
3. **Error Handling**: Graceful degradation when API limits are reached
4. **Connection Pooling**: Reuse HTTP connections for better performance

## 🔒 Security Implementation

### API Key Management

- Keys stored in configuration files (development)
- Environment variables recommended for production
- No hardcoded credentials in source code
- Secure HTTP client configuration

### Error Handling

- Comprehensive logging for debugging
- User-friendly error messages
- Automatic retry logic for transient failures
- Fallback to cached data when API is unavailable

## 🎯 Live Features

### Portfolio Dashboard Enhancements

- **Live Price Indicators**: Green pulsing dots show real-time data
- **Update Status**: Visual feedback during price updates
- **Timestamp Display**: Shows last successful update time
- **Error Recovery**: Retry buttons for failed requests

### Real-time Calculations

- Portfolio value updated every 5 seconds
- Gain/loss calculations using live prices
- Allocation percentages recalculated automatically
- Top performer tracking with real-time rankings

## 🛠 Development Commands

### Start the Application

```bash
# Backend (ASP.NET Core)
cd backend
dotnet run

# Frontend (Next.js)
cd frontend
npm run dev
```

### Monitor API Usage

- Check browser console for API call logs
- Monitor backend logs for Alpaca API responses
- Watch for rate limit warnings

## 📈 Upgrade Path

### Alpaca Pro Features (Algo Trader Plus - $99/month)

- **Complete Market Coverage**: All US exchanges
- **Unlimited Websockets**: No symbol restrictions
- **Higher Rate Limits**: 10,000 API calls per minute
- **Real-time Data**: No 15-minute delay
- **Options Data**: OPRA feed access

## 🐛 Troubleshooting

### Common Issues

#### API Key Authentication

```
Error: Unauthorized (401)
```

**Solution**: Verify API keys are correctly set in configuration

#### Rate Limit Exceeded

```
Error: Too Many Requests (429)
```

**Solution**: Implement backoff strategy or upgrade to paid plan

#### No Price Data

```
Warning: No quote data found for symbol
```

**Solution**: Check if symbol exists and market is open

### Debugging Steps

1. Verify API keys in appsettings.json
2. Check network connectivity to data.alpaca.markets
3. Monitor browser console for frontend errors
4. Review backend logs for API response details

## 📝 Example API Responses

### Latest Quote Response

```json
{
  "quotes": {
    "AAPL": {
      "ap": 175.50,
      "bp": 175.45,
      "as": 100,
      "bs": 200,
      "t": "2025-08-01T20:30:00Z"
    }
  }
}
```

### Historical Bars Response

```json
{
  "bars": {
    "AAPL": [
      {
        "c": 175.43,
        "h": 176.10,
        "l": 174.80,
        "o": 175.00,
        "t": "2025-08-01T04:00:00Z",
        "v": 50000000,
        "vw": 175.25
      }
    ]
  }
}
```

## 🎉 Benefits

### For Users

- **Real-time Portfolio Tracking**: Live market values
- **Accurate Performance Metrics**: Based on actual market prices
- **Professional Grade Data**: Same data used by financial institutions
- **Historical Analysis**: Trend tracking and performance visualization

### For Developers

- **Reliable Data Source**: Enterprise-grade market data API
- **Comprehensive Coverage**: Stocks, ETFs, and options
- **Developer-Friendly**: RESTful API with clear documentation
- **Scalable Architecture**: Built to handle high-frequency updates

## 🔮 Future Enhancements

### Phase 1: Enhanced Real-time Features

- WebSocket integration for instant price updates
- Real-time alerts and notifications
- Advanced charting with technical indicators

### Phase 2: Extended Market Coverage

- Crypto currency support
- International markets integration
- Forex and commodities data

### Phase 3: Advanced Analytics

- Portfolio optimization suggestions
- Risk analysis and metrics
- Performance benchmarking

---

# API Keys Setup Guide

## 🔒 Secure Configuration for CandleWise

### For Development (Local Machine)

1. **Create `backend/appsettings.Local.json`** (this file is git-ignored):

```json
{
  "Alpaca": {
    "ApiKeyId": "YOUR_ACTUAL_API_KEY_ID",
    "ApiSecretKey": "YOUR_ACTUAL_API_SECRET_KEY"
  }
}
```

2. **Get your free Alpaca API keys:**
   - Visit: <https://alpaca.markets/>
   - Create free account
   - Go to API section
   - Generate Paper Trading keys (free tier)

### For Production Deployment

Use environment variables instead of files:

#### Azure App Service

```bash
ALPACA__APIKEYID=your_key_id
ALPACA__APISECRETKEY=your_secret_key
```

#### Docker Environment

```bash
docker run -e ALPACA__APIKEYID=your_key_id -e ALPACA__APISECRETKEY=your_secret_key candlewise-backend
```

#### Local Environment Variables (Alternative)

```bash
# PowerShell
$env:ALPACA__APIKEYID="your_key_id"
$env:ALPACA__APISECRETKEY="your_secret_key"

# Command Prompt
set ALPACA__APIKEYID=your_key_id
set ALPACA__APISECRETKEY=your_secret_key
```

## 📋 Configuration Priority (Highest to Lowest)

1. Environment variables
2. `appsettings.Local.json` (development only)
3. `appsettings.Development.json`
4. `appsettings.json`

## ⚠️ Security Notes

- ❌ **NEVER** commit API keys to Git
- ✅ **DO** use `appsettings.Local.json` for development
- ✅ **DO** use environment variables for production
- ✅ **DO** regenerate keys if accidentally exposed
- ✅ **DO** use Paper Trading keys for development

## 🧪 Testing Configuration

Run this command to verify your setup:

```bash
dotnet run --urls=http://localhost:5245
```

Then test the API:

```bash
curl http://localhost:5245/api/stock
```

## 🚀 Quick Setup Commands

```bash
# Navigate to backend
cd backend

# Copy your API keys to local config
echo '{"Alpaca":{"ApiKeyId":"YOUR_KEY","ApiSecretKey":"YOUR_SECRET"}}' > appsettings.Local.json

# Run the application
dotnet run --urls=http://localhost:5245
```

**Ready to experience live market data in your portfolio management system!** 🚀

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ by Pedro PC Amellon**
