'use client';

import { useState, useEffect } from 'react';
import { Stock, StockHistoryPoint } from '../../../shared/types';
import { StockService } from '@/services/stockService';
import StockChart from './StockChart';

interface StockCardProps {
    stock: Stock;
    onShowChart: (stock: Stock) => void;
}

function StockCard({ stock, onShowChart }: StockCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
                    <p className="text-gray-600 text-sm">{stock.companyName}</p>
                </div>
                <div className="flex space-x-2">
                    <div className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded">
                        Live
                    </div>
                    <button
                        onClick={() => onShowChart(stock)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        📊
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <span className="text-2xl font-bold text-green-600">
                        ${stock.price.toFixed(2)}
                    </span>
                </div>
                <div className="text-xs text-gray-500">
                    Real-time
                </div>
            </div>
        </div>
    );
}

export default function StockDashboard() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [priceHistory, setPriceHistory] = useState<Record<string, StockHistoryPoint[]>>({});

    const handleShowChart = (stock: Stock) => {
        setSelectedStock(stock);
    };

    const handleCloseChart = () => {
        setSelectedStock(null);
    };

    // Function to fetch stock prices for dashboard display
    const fetchStockPrices = async () => {
        try {
            const stockData = await StockService.getAllStocks();

            // Ensure unique IDs to prevent React key conflicts
            const stocksWithUniqueIds = stockData.map((stock, index) => ({
                ...stock,
                id: stock.id || index + 1 // Fallback to index-based ID if id is missing or 0
            }));

            setStocks(stocksWithUniqueIds);
            setError(null);
            return stocksWithUniqueIds;
        } catch (err) {
            setError('Failed to fetch stock data');
            console.error('Error fetching stocks:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Function to update price history for charts
    const updatePriceHistory = async () => {
        try {
            const stockData = await StockService.getAllStocks();

            if (!stockData) return;

            const timestamp = new Date().toISOString();
            setPriceHistory(prevHistory => {
                const newHistory = { ...prevHistory };

                stockData.forEach(stock => {
                    if (!newHistory[stock.symbol]) {
                        newHistory[stock.symbol] = [];
                    }

                    // Add new price point
                    newHistory[stock.symbol].push({
                        timestamp,
                        price: stock.price
                    });

                    // Keep only last 60 points (10 minutes at 10-second intervals)
                    if (newHistory[stock.symbol].length > 60) {
                        newHistory[stock.symbol] = newHistory[stock.symbol].slice(-60);
                    }
                });

                return newHistory;
            });
        } catch (err) {
            console.error('Error updating price history:', err);
        }
    };

    // Effect for main dashboard price updates (every second)
    useEffect(() => {
        // Initial fetch
        fetchStockPrices();

        // Set up automatic refresh every second for price display
        const priceInterval = setInterval(() => {
            fetchStockPrices();
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(priceInterval);
    }, []);

    // Effect for chart history updates (every 10 seconds when modal is open)
    useEffect(() => {
        if (!selectedStock) return;

        // Initial history update when modal opens
        updatePriceHistory();

        // Set up automatic refresh every 10 seconds for chart history
        const historyInterval = setInterval(() => {
            updatePriceHistory();
        }, 10000);

        // Cleanup interval when modal closes or component unmounts
        return () => clearInterval(historyInterval);
    }, [selectedStock]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stocks.map((stock, index) => (
                    <StockCard
                        key={`${stock.symbol}-${stock.id}-${index}`}
                        stock={stock}
                        onShowChart={handleShowChart}
                    />
                ))}
            </div>

            {selectedStock && (
                <div className="fixed inset-0 bg-gray-300 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {selectedStock.companyName} ({selectedStock.symbol})
                            </h2>
                            <button
                                onClick={handleCloseChart}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <StockChart
                            symbol={selectedStock.symbol}
                            companyName={selectedStock.companyName}
                            priceHistory={priceHistory[selectedStock.symbol] || []}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
