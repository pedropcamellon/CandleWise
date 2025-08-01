// Portfolio Service for CandleWise Portfolio Management
import { 
  Portfolio, 
  PortfolioHolding, 
  Transaction, 
  PortfolioSummary, 
  AllocationBreakdown,
  ApiResponse 
} from '../../../shared/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5245/api';

export class PortfolioService {
  // ============== PORTFOLIO MANAGEMENT ==============
  
  static async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolios: ${response.statusText}`);
      }

      const data: ApiResponse<Portfolio[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching user portfolios:', error);
      throw error;
    }
  }

  static async getPortfolioById(portfolioId: string): Promise<Portfolio> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
      }

      const data: ApiResponse<Portfolio> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  }

  static async createPortfolio(userId: string, name: string, description?: string): Promise<Portfolio> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create portfolio: ${response.statusText}`);
      }

      const data: ApiResponse<Portfolio> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  }

  static async updatePortfolio(portfolioId: string, updates: Partial<Portfolio>): Promise<Portfolio> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update portfolio: ${response.statusText}`);
      }

      const data: ApiResponse<Portfolio> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  }

  static async deletePortfolio(portfolioId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete portfolio: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  }

  // ============== HOLDINGS MANAGEMENT ==============

  static async addHolding(
    portfolioId: string, 
    symbol: string, 
    shares: number, 
    costBasis: number
  ): Promise<PortfolioHolding> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}/holdings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol,
          shares,
          costBasis,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add holding: ${response.statusText}`);
      }

      const data: ApiResponse<PortfolioHolding> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error adding holding:', error);
      throw error;
    }
  }

  static async updateHolding(
    portfolioId: string, 
    holdingId: string, 
    updates: Partial<PortfolioHolding>
  ): Promise<PortfolioHolding> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}/holdings/${holdingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update holding: ${response.statusText}`);
      }

      const data: ApiResponse<PortfolioHolding> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating holding:', error);
      throw error;
    }
  }

  static async removeHolding(portfolioId: string, holdingId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}/holdings/${holdingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to remove holding: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error removing holding:', error);
      throw error;
    }
  }

  // ============== TRANSACTION MANAGEMENT ==============

  static async addTransaction(
    portfolioId: string,
    symbol: string,
    type: 'BUY' | 'SELL',
    shares: number,
    pricePerShare: number,
    notes?: string
  ): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol,
          type,
          shares,
          pricePerShare,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add transaction: ${response.statusText}`);
      }

      const data: ApiResponse<Transaction> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  static async getTransactionHistory(portfolioId: string): Promise<Transaction[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}/transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data: ApiResponse<Transaction[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // ============== ANALYTICS & CALCULATIONS ==============

  static async getPortfolioSummary(portfolioId: string): Promise<PortfolioSummary> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio summary: ${response.statusText}`);
      }

      const data: ApiResponse<PortfolioSummary> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching portfolio summary:', error);
      throw error;
    }
  }

  static async getAllocationBreakdown(portfolioId: string): Promise<AllocationBreakdown[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}/allocation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch allocation breakdown: ${response.statusText}`);
      }

      const data: ApiResponse<AllocationBreakdown[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching allocation breakdown:', error);
      throw error;
    }
  }

  // ============== DEMO DATA (For Development) ==============
  
  static async getDemoPortfolio(): Promise<Portfolio> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/demo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch demo portfolio: ${response.statusText}`);
      }

      const data: ApiResponse<Portfolio> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching demo portfolio:', error);
      // Fallback to hardcoded demo data
      return this.getHardcodedDemoPortfolio();
    }
  }

  static async getDemoSummary(): Promise<PortfolioSummary> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/demo/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch demo summary: ${response.statusText}`);
      }

      const data: ApiResponse<PortfolioSummary> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching demo summary:', error);
      // Fallback to hardcoded demo data
      return this.getHardcodedDemoSummary();
    }
  }

  // ============== FALLBACK DEMO DATA ==============
  
  private static getHardcodedDemoPortfolio(): Portfolio {
    const demoPortfolio: Portfolio = {
      id: 'demo-portfolio-1',
      userId: 'demo-user-1',
      name: 'My Investment Portfolio',
      description: 'Long-term growth focused portfolio',
      totalValue: 12750.00,
      totalGainLoss: 1250.00,
      totalGainLossPercent: 10.87,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      holdings: [
        {
          id: 'holding-1',
          portfolioId: 'demo-portfolio-1',
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          shares: 50,
          averageCostBasis: 180.00,
          currentPrice: 195.00,
          marketValue: 9750.00,
          totalCost: 9000.00,
          gainLoss: 750.00,
          gainLossPercent: 8.33,
          allocationPercent: 76.47,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date(),
        },
        {
          id: 'holding-2',
          portfolioId: 'demo-portfolio-1',
          symbol: 'GOOGL',
          companyName: 'Alphabet Inc.',
          shares: 10,
          averageCostBasis: 250.00,
          currentPrice: 300.00,
          marketValue: 3000.00,
          totalCost: 2500.00,
          gainLoss: 500.00,
          gainLossPercent: 20.00,
          allocationPercent: 23.53,
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date(),
        },
      ],
    };

    return demoPortfolio;
  }

  private static getHardcodedDemoSummary(): PortfolioSummary {
    const demoSummary: PortfolioSummary = {
      totalValue: 12750.00,
      totalCost: 11500.00,
      totalGainLoss: 1250.00,
      totalGainLossPercent: 10.87,
      dayChange: 125.50,
      dayChangePercent: 0.99,
      topPerformer: {
        symbol: 'GOOGL',
        gainLossPercent: 20.00,
      },
      topLoser: null,
    };

    return demoSummary;
  }
}
