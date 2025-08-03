import { Stock } from '../../../shared/types';

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

  static async getMultipleStockPrices(symbols: string[]): Promise<{ 
    prices: Record<string, { symbol: string; price: number; companyName: string }>; 
    missingSymbols: string[]; 
    timestamp: string 
  }> {
    try {
      if (!symbols || symbols.length === 0) {
        throw new Error('Symbols array is required and cannot be empty');
      }

      const response = await fetch(`${API_BASE_URL}/stock/prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === 'API_CREDENTIALS_MISSING') {
          throw new Error(`Alpaca API Configuration Error: ${errorData.message || 'API credentials are missing. Please configure your Alpaca API keys.'}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        prices: data.data.prices,
        missingSymbols: data.data.missingSymbols,
        timestamp: data.data.timestamp,
      };
    } catch (error) {
      console.error(`Error fetching prices for symbols: ${symbols.join(', ')}:`, error);
      throw error;
    }
  }
}
