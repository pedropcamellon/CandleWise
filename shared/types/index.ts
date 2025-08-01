// Shared TypeScript definitions for CandleWise Portfolio Management

// ============== PORTFOLIO TYPES ==============
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  createdAt: Date;
  updatedAt: Date;
  holdings: PortfolioHolding[];
}

export interface PortfolioHolding {
  id: string;
  portfolioId: string;
  symbol: string;
  companyName: string;
  shares: number;
  averageCostBasis: number;
  currentPrice: number;
  marketValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercent: number;
  allocationPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  portfolioId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  transactionDate: Date;
  notes?: string;
}

// ============== MARKET DATA TYPES ==============
export interface Stock {
  id: number;
  symbol: string;
  companyName: string;
  price: number;
  changePercent?: number;
  volume?: number;
}

export interface StockPrice {
  symbol: string;
  price: number;
  timestamp: Date;
  changePercent?: number;
  volume?: number;
}

export interface StockHistoryPoint {
  timestamp: string;
  price: number;
}

export interface StockBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ============== API TYPES ==============
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface AlpacaResponse {
  bars: {
    [symbol: string]: StockBar[];
  };
  next_page_token: string | null;
}

// ============== PORTFOLIO ANALYTICS ==============
export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  topPerformer: {
    symbol: string;
    gainLossPercent: number;
  } | null;
  topLoser: {
    symbol: string;
    gainLossPercent: number;
  } | null;
}

export interface AllocationBreakdown {
  symbol: string;
  companyName: string;
  allocationPercent: number;
  marketValue: number;
}

// ============== UI STATE TYPES ==============
export interface PortfolioViewState {
  selectedPortfolio: Portfolio | null;
  selectedHolding: PortfolioHolding | null;
  showAddHoldingModal: boolean;
  showTransactionModal: boolean;
  showPortfolioSettings: boolean;
}
