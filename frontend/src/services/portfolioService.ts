// Portfolio Service for CandleWise Portfolio Management
import {
  Portfolio,
  PortfolioHolding,
  Transaction,
  AllocationBreakdown,
  ApiResponse
} from '../../../shared/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

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

  // ============== MAIN DATA ENDPOINTS ==============

  // ============== MAIN DATA ENDPOINTS ==============

  static async getDefaultPortfolio(): Promise<Portfolio> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/default`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
      }

      const data: Portfolio = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching default portfolio:', error);
      throw error;
    }
  }

  static async getAllocationBreakdown(portfolioId?: string): Promise<AllocationBreakdown[]> {
    try {
      const endpoint = portfolioId ? `/portfolio/${portfolioId}/allocation` : '/portfolio/default/allocation';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch allocation breakdown: ${response.statusText}`);
      }

      const data: AllocationBreakdown[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching allocation breakdown:', error);
      throw error;
    }
  }

}
