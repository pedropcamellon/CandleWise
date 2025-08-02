'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Portfolio,
    PortfolioHolding,
    PortfolioSummary,
    StockHistoryPoint
} from '../../../shared/types';
import { PortfolioService } from '@/services/portfolioService';
import { StockService } from '@/services/stockService';
import StockChart from './StockChart';

interface PortfolioSummaryCardProps {
    summary: PortfolioSummary;
}

function PortfolioSummaryCard({ summary }: PortfolioSummaryCardProps) {
    const [currentSummary, setCurrentSummary] = useState(summary);

    useEffect(() => {
        setCurrentSummary(summary);
    }, [summary]);

    const gainLossColor = currentSummary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600';
    const dayChangeColor = currentSummary.dayChange >= 0 ? 'text-green-600' : 'text-red-600';

    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Portfolio Value */}
                <div className="text-center">
                    <h3 className="text-lg font-medium opacity-90">Total Portfolio Value</h3>
                    <p className="text-3xl font-bold mt-2">${currentSummary.totalValue.toLocaleString()}</p>
                    {currentSummary.dayChange !== undefined && currentSummary.dayChangePercent !== undefined ? (
                        <div className={`flex items-center justify-center mt-2 ${dayChangeColor}`}>
                            <span className="text-sm">
                                {currentSummary.dayChange >= 0 ? '+' : ''}${currentSummary.dayChange.toFixed(2)}
                                ({currentSummary.dayChangePercent >= 0 ? '+' : ''}{currentSummary.dayChangePercent.toFixed(2)}%) today
                            </span>
                        </div>
                    ) : (
                        <p className="text-sm opacity-75 mt-2">No data available</p>
                    )}
                </div>

                {/* Total Gain/Loss */}
                <div className="text-center">
                    <h3 className="text-lg font-medium opacity-90">Total Gain/Loss</h3>
                    <p className={`text-3xl font-bold mt-2 ${gainLossColor}`}>
                        {currentSummary.totalGainLoss >= 0 ? '+' : ''}${currentSummary.totalGainLoss.toLocaleString()}
                    </p>
                    <div className={`mt-2 ${gainLossColor}`}>
                        <span className="text-sm">
                            ({currentSummary.totalGainLossPercent >= 0 ? '+' : ''}{currentSummary.totalGainLossPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>

                {/* Performance Highlights */}
                <div className="text-center">
                    <h3 className="text-lg font-medium opacity-90">Top Performer</h3>
                    {summary.topPerformer ? (
                        <div className="mt-2">
                            <p className="text-xl font-bold">{summary.topPerformer.symbol}</p>
                            <p className="text-green-400 text-sm">
                                +{summary.topPerformer.gainLossPercent.toFixed(2)}%
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm opacity-75 mt-2">No data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

interface HoldingCardProps {
    holding: PortfolioHolding;
    onShowChart: (holding: PortfolioHolding) => void;
    onEdit: (holding: PortfolioHolding) => void;
    onPriceUpdate?: (symbol: string, newPrice: number) => void;
}

function HoldingCard({ holding, onShowChart, onEdit, onPriceUpdate }: HoldingCardProps) {
    const [currentPrice, setCurrentPrice] = useState(holding.currentPrice);
    const [marketValue, setMarketValue] = useState(holding.marketValue);
    const [gainLoss, setGainLoss] = useState(holding.gainLoss);
    const [gainLossPercent, setGainLossPercent] = useState(holding.gainLossPercent);
    const [isUpdating, setIsUpdating] = useState(false);
    const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'same'>('same');

    const previousPriceRef = useRef(currentPrice);
    const cardRef = useRef<HTMLDivElement>(null);

    // Update calculations when price changes
    const updateCalculations = useCallback((newPrice: number) => {
        const newMarketValue = holding.shares * newPrice;
        const newGainLoss = newMarketValue - holding.totalCost;
        const newGainLossPercent = (newGainLoss / holding.totalCost) * 100;

        // Determine price direction for visual feedback
        if (newPrice > previousPriceRef.current) {
            setPriceDirection('up');
        } else if (newPrice < previousPriceRef.current) {
            setPriceDirection('down');
        } else {
            setPriceDirection('same');
        }

        setCurrentPrice(newPrice);
        setMarketValue(newMarketValue);
        setGainLoss(newGainLoss);
        setGainLossPercent(newGainLossPercent);

        previousPriceRef.current = newPrice;

        // Add flash effect
        if (cardRef.current) {
            cardRef.current.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-75');
            setTimeout(() => {
                if (cardRef.current) {
                    cardRef.current.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-75');
                }
            }, 1000);
        }

        // Notify parent component
        onPriceUpdate?.(holding.symbol, newPrice);
    }, [holding.shares, holding.totalCost, holding.symbol, onPriceUpdate]);

    // Fetch real-time price update for this specific holding
    const fetchPriceUpdate = useCallback(async () => {
        if (isUpdating) return;

        try {
            setIsUpdating(true);
            const price = await StockService.getStockPrice(holding.symbol);
            if (price && price !== currentPrice) {
                updateCalculations(price);
            }
        } catch (error) {
            console.error(`Error updating price for ${holding.symbol}:`, error);
            // Show specific error message for API credentials
            if (error instanceof Error && error.message.includes('Alpaca API Configuration Error')) {
                console.error('API Configuration Issue:', error.message);
            }
        } finally {
            setIsUpdating(false);
        }
    }, [holding.symbol, currentPrice, isUpdating, updateCalculations]);

    // Auto-update every 30 seconds
    useEffect(() => {
        const interval = setInterval(fetchPriceUpdate, 30000);
        return () => clearInterval(interval);
    }, [fetchPriceUpdate]);

    const gainLossColor = gainLoss >= 0 ? 'text-green-600' : 'text-red-600';
    const priceChangeColor = priceDirection === 'up' ? 'text-green-600' :
        priceDirection === 'down' ? 'text-red-600' : 'text-gray-900';

    return (
        <div
            ref={cardRef}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{holding.symbol}</h3>
                    <p className="text-gray-600 text-sm">{holding.companyName}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${priceChangeColor}`}>
                            ${currentPrice.toFixed(2)}
                        </span>
                        {isUpdating && (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                    </div>
                    <div className="flex items-center justify-end mt-1">
                        {priceDirection === 'up' && <span className="text-green-600 text-sm">↗</span>}
                        {priceDirection === 'down' && <span className="text-red-600 text-sm">↘</span>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Market Value */}
                <div>
                    <p className="text-sm text-gray-500">Market Value</p>
                    <p className="text-lg font-bold text-gray-900">
                        ${marketValue.toLocaleString()}
                    </p>
                </div>

                {/* Shares & Allocation */}
                <div>
                    <p className="text-sm text-gray-500">Shares | Allocation</p>
                    <p className="text-lg font-bold text-gray-900">
                        {holding.shares} | {holding.allocationPercent.toFixed(1)}%
                    </p>
                </div>

                {/* Gain/Loss */}
                <div>
                    <p className="text-sm text-gray-500">Gain/Loss</p>
                    <p className={`text-lg font-bold ${gainLossColor}`}>
                        {gainLoss >= 0 ? '+' : ''}${gainLoss.toLocaleString()}
                    </p>
                </div>

                {/* Performance */}
                <div>
                    <p className="text-sm text-gray-500">Performance</p>
                    <span className={`text-lg font-bold ${gainLossColor}`}>
                        {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => onShowChart(holding)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                    📊 Chart
                </button>
                <button
                    onClick={() => onEdit(holding)}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                    ✏️ Edit
                </button>
                <button
                    onClick={fetchPriceUpdate}
                    disabled={isUpdating}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                >
                    {isUpdating ? '↻' : '⟳'}
                </button>
            </div>
        </div>
    );
}

export default function PortfolioDashboard() {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [summary, setSummary] = useState<PortfolioSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);
    const [priceHistory, setPriceHistory] = useState<Record<string, StockHistoryPoint[]>>({});
    const [showAddHolding, setShowAddHolding] = useState(false);

    // Optimized state for individual card updates
    const priceUpdateTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
    const lastSuccessfulPrices = useRef<Record<string, number>>({});

    // Optimized price update callback for individual holdings
    const handlePriceUpdate = useCallback(async (symbol: string): Promise<number | null> => {
        try {
            // Clear existing timeout for this symbol
            if (priceUpdateTimeouts.current[symbol]) {
                clearTimeout(priceUpdateTimeouts.current[symbol]);
            }

            const newPrice = await StockService.getStockPrice(symbol);

            // Store successful price for fallback
            lastSuccessfulPrices.current[symbol] = newPrice;

            // Update the specific holding in portfolio
            setPortfolio(prev => {
                if (!prev) return prev;

                const updatedHoldings = prev.holdings.map(holding => {
                    if (holding.symbol === symbol) {
                        const updatedMarketValue = holding.shares * newPrice;
                        const updatedGainLoss = updatedMarketValue - holding.totalCost;
                        const updatedGainLossPercent = (updatedGainLoss / holding.totalCost) * 100;

                        return {
                            ...holding,
                            currentPrice: newPrice,
                            marketValue: updatedMarketValue,
                            gainLoss: updatedGainLoss,
                            gainLossPercent: updatedGainLossPercent,
                        };
                    }
                    return holding;
                });

                // Recalculate portfolio totals
                const totalMarketValue = updatedHoldings.reduce((sum, holding) => sum + holding.marketValue, 0);
                const totalCost = updatedHoldings.reduce((sum, holding) => sum + holding.totalCost, 0);
                const totalGainLoss = totalMarketValue - totalCost;
                const totalGainLossPercent = (totalGainLoss / totalCost) * 100;

                // Update allocation percentages
                const holdingsWithAllocation = updatedHoldings.map(holding => ({
                    ...holding,
                    allocationPercent: (holding.marketValue / totalMarketValue) * 100,
                }));

                // Update summary as well
                setSummary(prevSummary => prevSummary ? {
                    ...prevSummary,
                    totalValue: totalMarketValue,
                    totalGainLoss,
                    totalGainLossPercent,
                } : null);

                return {
                    ...prev,
                    holdings: holdingsWithAllocation,
                    totalValue: totalMarketValue,
                    totalGainLoss,
                    totalGainLossPercent,
                };
            });

            // Set up automatic refresh for this symbol
            priceUpdateTimeouts.current[symbol] = setTimeout(() => {
                handlePriceUpdate(symbol);
            }, 30000); // 30 seconds

            return newPrice;
        } catch (error) {
            console.error(`Error updating price for ${symbol}:`, error);
            // Return last successful price if available
            return lastSuccessfulPrices.current[symbol] || null;
        }
    }, []);

    const handleShowChart = (holding: PortfolioHolding) => {
        setSelectedHolding(holding);
    };

    const handleCloseChart = () => {
        setSelectedHolding(null);
    };

    const handleEditHolding = (holding: PortfolioHolding) => {
        console.log('Edit holding:', holding);
        // TODO: Implement edit holding modal
    };

    const handleAddHolding = () => {
        setShowAddHolding(true);

        console.log('Add new holding:', showAddHolding);
    };

    // Initial portfolio data fetch with optimized price updates
    const fetchPortfolioData = useCallback(async () => {
        try {
            setIsLoading(true);

            // For now, use demo data (will be replaced with real API calls)
            const portfolioData = await PortfolioService.getDemoPortfolio();
            const summaryData = await PortfolioService.getDemoSummary();

            // Update current prices from stock service
            const updatedHoldings = await Promise.all(
                portfolioData.holdings.map(async (holding) => {
                    try {
                        const currentPrice = await StockService.getStockPrice(holding.symbol);

                        // Store successful price for fallback
                        lastSuccessfulPrices.current[holding.symbol] = currentPrice;

                        const updatedMarketValue = holding.shares * currentPrice;
                        const updatedGainLoss = updatedMarketValue - holding.totalCost;
                        const updatedGainLossPercent = (updatedGainLoss / holding.totalCost) * 100;

                        return {
                            ...holding,
                            currentPrice,
                            marketValue: updatedMarketValue,
                            gainLoss: updatedGainLoss,
                            gainLossPercent: updatedGainLossPercent,
                        };
                    } catch (error) {
                        console.error(`Error updating price for ${holding.symbol}:`, error);
                        return holding;
                    }
                })
            );

            // Recalculate portfolio totals
            const totalMarketValue = updatedHoldings.reduce((sum, holding) => sum + holding.marketValue, 0);
            const totalCost = updatedHoldings.reduce((sum, holding) => sum + holding.totalCost, 0);
            const totalGainLoss = totalMarketValue - totalCost;
            const totalGainLossPercent = (totalGainLoss / totalCost) * 100;

            // Update allocation percentages
            const holdingsWithAllocation = updatedHoldings.map(holding => ({
                ...holding,
                allocationPercent: (holding.marketValue / totalMarketValue) * 100,
            }));

            const updatedPortfolio: Portfolio = {
                ...portfolioData,
                holdings: holdingsWithAllocation,
                totalValue: totalMarketValue,
                totalGainLoss,
                totalGainLossPercent,
            };

            const updatedSummary: PortfolioSummary = {
                ...summaryData,
                totalValue: totalMarketValue,
                totalGainLoss,
                totalGainLossPercent,
            };

            setPortfolio(updatedPortfolio);
            setSummary(updatedSummary);
            setError(null);

            // Set up automatic price updates for each holding
            updatedPortfolio.holdings.forEach(holding => {
                if (priceUpdateTimeouts.current[holding.symbol]) {
                    clearTimeout(priceUpdateTimeouts.current[holding.symbol]);
                }
                priceUpdateTimeouts.current[holding.symbol] = setTimeout(() => {
                    handlePriceUpdate(holding.symbol);
                }, 30000); // 30 seconds
            });

        } catch (err) {
            setError('Failed to fetch portfolio data');
            console.error('Error fetching portfolio:', err);
        } finally {
            setIsLoading(false);
        }
    }, [handlePriceUpdate]);

    // Function to update price history for charts
    const updatePriceHistory = async () => {
        if (!portfolio) return;

        try {
            const stockData = await StockService.getAllStocks();
            const timestamp = new Date().toISOString();

            setPriceHistory(prevHistory => {
                const newHistory = { ...prevHistory };

                portfolio.holdings.forEach(holding => {
                    const stockInfo = stockData.find(stock => stock.symbol === holding.symbol);
                    if (stockInfo) {
                        if (!newHistory[holding.symbol]) {
                            newHistory[holding.symbol] = [];
                        }

                        newHistory[holding.symbol].push({
                            timestamp,
                            price: stockInfo.price
                        });

                        // Keep only last 60 points (10 minutes at 10-second intervals)
                        if (newHistory[holding.symbol].length > 60) {
                            newHistory[holding.symbol] = newHistory[holding.symbol].slice(-60);
                        }
                    }
                });

                return newHistory;
            });
        } catch (err) {
            console.error('Error updating price history:', err);
        }
    };

    // Effect for initial portfolio data load
    useEffect(() => {
        fetchPortfolioData();

        // Cleanup function to clear all timeouts
        return () => {
            Object.values(priceUpdateTimeouts.current).forEach(timeout => {
                clearTimeout(timeout);
            });
            priceUpdateTimeouts.current = {};
        };
    }, [fetchPortfolioData]);

    // Effect for chart history updates (every 10 seconds when modal is open)
    useEffect(() => {
        if (!selectedHolding) return;

        updatePriceHistory();

        const historyInterval = setInterval(() => {
            updatePriceHistory();
        }, 10000);

        return () => clearInterval(historyInterval);
    }, [selectedHolding, portfolio]);

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

    if (!portfolio || !summary) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-700">No portfolio data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Portfolio Summary */}
            <PortfolioSummaryCard summary={summary} />

            {/* Holdings Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Holdings</h2>
                    <button
                        onClick={handleAddHolding}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Add Stock
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {portfolio.holdings.map((holding) => (
                        <HoldingCard
                            key={holding.id}
                            holding={holding}
                            onShowChart={handleShowChart}
                            onEdit={handleEditHolding}
                            onPriceUpdate={handlePriceUpdate}
                        />
                    ))}
                </div>

                {portfolio.holdings.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No holdings yet</p>
                        <p className="text-gray-400 text-sm mt-2">Add your first stock to get started</p>
                    </div>
                )}
            </div>

            {/* Chart Modal */}
            {selectedHolding && (
                <div className="fixed inset-0 bg-gray-300 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {selectedHolding.companyName} ({selectedHolding.symbol})
                            </h2>
                            <button
                                onClick={handleCloseChart}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Holding Details */}
                        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Your Shares</p>
                                <p className="text-lg font-bold">{selectedHolding.shares}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Market Value</p>
                                <p className="text-lg font-bold">${selectedHolding.marketValue.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Gain/Loss</p>
                                <p className={`text-lg font-bold ${selectedHolding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {selectedHolding.gainLoss >= 0 ? '+' : ''}${selectedHolding.gainLoss.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <StockChart
                            symbol={selectedHolding.symbol}
                            companyName={selectedHolding.companyName}
                            priceHistory={priceHistory[selectedHolding.symbol] || []}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
