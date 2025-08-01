import { Stock, ApiResponse, StockHistoryPoint } from '../../../shared/types';

// Now calling Next.js API routes instead of .NET Core directly
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class StockService {
  static async getAllStocks(): Promise<Stock[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/stock`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === 'API_CREDENTIALS_MISSING') {
          throw new Error(`Alpaca API Configuration Error: ${errorData.message || 'API credentials are missing. Please configure your Alpaca API keys.'}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw error;
    }
  }

  static async getStockPrice(symbol: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/stock/${symbol}/price`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === 'API_CREDENTIALS_MISSING') {
          throw new Error(`Alpaca API Configuration Error: ${errorData.message || 'API credentials are missing. Please configure your Alpaca API keys.'}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      throw error;
    }
  }
}
