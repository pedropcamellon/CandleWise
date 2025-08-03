'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Portfolio,
    PortfolioHolding,
    StockHistoryPoint
} from '../../../shared/types';
import { PortfolioService } from '@/services/portfolioService';
import { StockService } from '@/services/stockService';
import StockChart from './StockChart';

interface PortfolioSummaryCardProps {
    portfolio: Portfolio;
}

function PortfolioSummaryCard({ portfolio }: PortfolioSummaryCardProps) {
    const [currentPortfolio, setCurrentPortfolio] = useState(portfolio);

    useEffect(() => {
        setCurrentPortfolio(portfolio);
    }, [portfolio]);

    const gainLossColor = currentPortfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600';
    const dayChangeColor = currentPortfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600';

    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Portfolio Value */}
                <div className="text-center">
                    <h3 className="text-lg font-medium opacity-90">Total Portfolio Value</h3>
                    <p className="text-3xl font-bold mt-2">${currentPortfolio.totalValue.toLocaleString()}</p>
                    {currentPortfolio.dayChange !== undefined && currentPortfolio.dayChangePercent !== undefined ? (
                        <div className={`flex items-center justify-center mt-2 ${dayChangeColor}`}>
                            <span className="text-sm">
                                {currentPortfolio.dayChange >= 0 ? '+' : ''}${currentPortfolio.dayChange.toFixed(2)}
                                ({currentPortfolio.dayChangePercent >= 0 ? '+' : ''}{currentPortfolio.dayChangePercent.toFixed(2)}%) today
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
                        {currentPortfolio.totalGainLoss >= 0 ? '+' : ''}${currentPortfolio.totalGainLoss.toLocaleString()}
                    </p>
                    <div className={`mt-2 ${gainLossColor}`}>
                        <span className="text-sm">
                            ({currentPortfolio.totalGainLossPercent >= 0 ? '+' : ''}{currentPortfolio.totalGainLossPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>

                {/* Performance Highlights */}
                <div className="text-center">
                    <h3 className="text-lg font-medium opacity-90">Top Performer</h3>
                    {currentPortfolio.topPerformer ? (
                        <div className="mt-2">
                            <p className="text-xl font-bold">{currentPortfolio.topPerformer.symbol}</p>
                            <p className="text-green-400 text-sm">
                                +{currentPortfolio.topPerformer.gainLossPercent.toFixed(2)}%
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
    onManualRefresh: (symbol: string) => void;
}

function HoldingCard({ holding, onShowChart, onEdit, onManualRefresh }: HoldingCardProps) {
    // Calculate initial values from simplified holding
    const totalCost = holding.shares * holding.averageCostBasis;
    const initialPrice = (holding as any).currentPrice || holding.averageCostBasis;
    const initialMarketValue = (holding as any).marketValue || totalCost;
    const initialGainLoss = (holding as any).gainLoss || 0;
    const initialGainLossPercent = (holding as any).gainLossPercent || 0;
    const companyName = (holding as any).companyName || holding.symbol;

    const [currentPrice, setCurrentPrice] = useState(initialPrice);
    const [marketValue, setMarketValue] = useState(initialMarketValue);
    const [gainLoss, setGainLoss] = useState(initialGainLoss);
    const [gainLossPercent, setGainLossPercent] = useState(initialGainLossPercent);
    const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'same'>('same');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const previousPriceRef = useRef(initialPrice);
    const cardRef = useRef<HTMLDivElement>(null);

    // Manual refresh for individual holding
    const handleManualRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        await onManualRefresh(holding.symbol);
        setIsRefreshing(false);
    };

    // Update local state when holding prop changes (from parent price updates)
    useEffect(() => {
        const newPrice = (holding as any).currentPrice || holding.averageCostBasis;
        const newMarketValue = (holding as any).marketValue || holding.shares * holding.averageCostBasis;
        const newGainLoss = (holding as any).gainLoss || 0;
        const newGainLossPercent = (holding as any).gainLossPercent || 0;

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

        // Add flash effect when price changes
        if (newPrice !== previousPriceRef.current && cardRef.current) {
            cardRef.current.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-75');
            setTimeout(() => {
                if (cardRef.current) {
                    cardRef.current.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-75');
                }
            }, 1000);
        }

        previousPriceRef.current = newPrice;
    }, [holding]);

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
                    <p className="text-gray-600 text-sm">{companyName}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${priceChangeColor}`}>
                            ${currentPrice.toFixed(2)}
                        </span>
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
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                >
                    {isRefreshing ? '↻' : '⟳'}
                </button>
            </div>
        </div>
    );
}

export default function PortfolioDashboard() {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);
    const [priceHistory, setPriceHistory] = useState<Record<string, StockHistoryPoint[]>>({});
    const [showAddHolding, setShowAddHolding] = useState(false);
    const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);

    // Optimized state for price updates
    const lastSuccessfulPrices = useRef<Record<string, number>>({});
    const priceUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Update price history based on price results
    const updatePriceHistory = useCallback((priceResults: Array<{ symbol: string; price: number }>, timestamp: string) => {
        setPriceHistory(prevHistory => {
            const newHistory = { ...prevHistory };

            priceResults.forEach(({ symbol, price }) => {
                if (!newHistory[symbol]) {
                    newHistory[symbol] = [];
                }

                newHistory[symbol].push({
                    timestamp,
                    price
                });

                // Keep only last 60 points (10 minutes at 10-second intervals)
                if (newHistory[symbol].length > 60) {
                    newHistory[symbol] = newHistory[symbol].slice(-60);
                }
            });

            return newHistory;
        });
    }, []);

    // Update portfolio based on price results
    const updatePortfolioWithPrices = useCallback((priceResults: Array<{ symbol: string; price: number }>) => {
        setPortfolio(prev => {
            if (!prev) return prev;

            const priceMap = new Map(priceResults.map(result => [result.symbol, result.price]));

            const updatedHoldings = prev.holdings.map(holding => {
                const newPrice = priceMap.get(holding.symbol);
                if (newPrice !== undefined) {
                    const updatedMarketValue = holding.shares * newPrice;
                    const totalCost = holding.shares * holding.averageCostBasis;
                    const updatedGainLoss = updatedMarketValue - totalCost;
                    const updatedGainLossPercent = (updatedGainLoss / totalCost) * 100;

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
            const totalMarketValue = updatedHoldings.reduce((sum, holding) =>
                sum + ((holding as any).marketValue || holding.shares * ((holding as any).currentPrice || 0)), 0);
            const totalCost = updatedHoldings.reduce((sum, holding) =>
                sum + (holding.shares * holding.averageCostBasis), 0);
            const totalGainLoss = totalMarketValue - totalCost;
            const totalGainLossPercent = (totalGainLoss / totalCost) * 100;

            return {
                ...prev,
                holdings: updatedHoldings as any,
                totalValue: totalMarketValue,
                totalGainLoss,
                totalGainLossPercent,
            };
        });
    }, []);

    // Fetch prices for all portfolio stocks - priceResults as source of truth
    const updateAllPrices = useCallback(async () => {
        if (!portfolio) return;

        const timestamp = new Date().toISOString();

        try {
            // Extract all symbols from portfolio holdings
            const symbols = portfolio.holdings.map(holding => holding.symbol);

            // Fetch all prices in a single batch call for better performance
            const batchResult = await StockService.getMultipleStockPrices(symbols);

            // Convert batch result to priceResults format
            const priceResults: Array<{ symbol: string; price: number }> = [];

            // Process successful prices
            Object.entries(batchResult.prices).forEach(([symbol, priceInfo]) => {
                priceResults.push({ symbol, price: priceInfo.price });
                lastSuccessfulPrices.current[symbol] = priceInfo.price;
            });

            // Handle missing symbols with fallback to last successful prices
            batchResult.missingSymbols.forEach(symbol => {
                const lastPrice = lastSuccessfulPrices.current[symbol];
                if (lastPrice) {
                    priceResults.push({ symbol, price: lastPrice });
                    console.warn(`Using cached price for ${symbol}: $${lastPrice}`);
                } else {
                    console.error(`No price available for ${symbol} and no cached price`);
                }
            });

            // priceResults as source of truth - update history and portfolio separately
            if (priceResults.length > 0) {
                updatePriceHistory(priceResults, timestamp);
                updatePortfolioWithPrices(priceResults);
            }
        } catch (error) {
            console.error('Error updating all prices:', error);

            // Log error but don't fallback to individual calls - batch is our only method
            console.log('Batch price update failed. Prices will be updated on next cycle.');
        }
    }, [updatePriceHistory, updatePortfolioWithPrices]);

    // Manual refresh for specific symbol
    const handleManualRefresh = useCallback(async (symbol: string) => {
        try {
            // Use batch call even for single symbol for consistency
            const batchResult = await StockService.getMultipleStockPrices([symbol]);
            const priceInfo = batchResult.prices[symbol];

            if (priceInfo !== undefined) {
                lastSuccessfulPrices.current[symbol] = priceInfo.price;

                const timestamp = new Date().toISOString();
                const priceResult = { symbol, price: priceInfo.price };

                // Use priceResults as source of truth - update history and portfolio separately
                updatePriceHistory([priceResult], timestamp);
                updatePortfolioWithPrices([priceResult]);
            } else {
                console.error(`No price data available for manual refresh of ${symbol}`);
            }
        } catch (error) {
            console.error(`Error manually refreshing price for ${symbol}:`, error);
        }
    }, [updatePriceHistory, updatePortfolioWithPrices]); const handleShowChart = (holding: PortfolioHolding) => {
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

    // Initial portfolio data fetch
    const fetchPortfolioData = useCallback(async () => {
        try {
            setIsLoading(true);

            // Get portfolio data from API (now includes summary data)
            const portfolioData = await PortfolioService.getDefaultPortfolio();

            // Extract all symbols from portfolio holdings
            const symbols = portfolioData.holdings.map(holding => holding.symbol);

            // Fetch all prices in a single batch call for better performance
            let updatedHoldings = portfolioData.holdings;

            if (symbols.length > 0) {
                try {
                    const batchResult = await StockService.getMultipleStockPrices(symbols);

                    // Update holdings with current prices from batch result
                    updatedHoldings = portfolioData.holdings.map(holding => {
                        const priceInfo = batchResult.prices[holding.symbol];

                        if (priceInfo !== undefined) {
                            // Store successful price for fallback
                            lastSuccessfulPrices.current[holding.symbol] = priceInfo.price;

                            const totalCost = holding.shares * holding.averageCostBasis;
                            const updatedMarketValue = holding.shares * priceInfo.price;
                            const updatedGainLoss = updatedMarketValue - totalCost;
                            const updatedGainLossPercent = (updatedGainLoss / totalCost) * 100;

                            return {
                                ...holding,
                                companyName: priceInfo.companyName,
                                currentPrice: priceInfo.price,
                                marketValue: updatedMarketValue,
                                totalCost,
                                gainLoss: updatedGainLoss,
                                gainLossPercent: updatedGainLossPercent,
                            };
                        } else {
                            console.warn(`No price data available for ${holding.symbol}, using default values`);
                            const totalCost = holding.shares * holding.averageCostBasis;
                            return {
                                ...holding,
                                companyName: holding.symbol, // Fallback to symbol
                                currentPrice: holding.averageCostBasis, // Fallback to cost basis
                                marketValue: totalCost,
                                totalCost,
                                gainLoss: 0,
                                gainLossPercent: 0,
                            };
                        }
                    });
                } catch (error) {
                    console.error('Error fetching batch prices during initialization:', error);
                    console.log('Using portfolio data with fallback prices');
                    // Create fallback holdings with cost basis as price
                    updatedHoldings = portfolioData.holdings.map(holding => {
                        const totalCost = holding.shares * holding.averageCostBasis;
                        return {
                            ...holding,
                            companyName: holding.symbol, // Fallback to symbol
                            currentPrice: holding.averageCostBasis,
                            marketValue: totalCost,
                            totalCost,
                            gainLoss: 0,
                            gainLossPercent: 0,
                        };
                    });
                }
            }

            // Recalculate portfolio totals
            const totalMarketValue = updatedHoldings.reduce((sum, holding) => sum + (holding as any).marketValue, 0);
            const totalCost = updatedHoldings.reduce((sum, holding) => sum + (holding as any).totalCost, 0);
            const totalGainLoss = totalMarketValue - totalCost;
            const totalGainLossPercent = (totalGainLoss / totalCost) * 100;

            const updatedPortfolio: Portfolio = {
                ...portfolioData,
                holdings: updatedHoldings as any,
                totalValue: totalMarketValue,
                totalGainLoss,
                totalGainLossPercent,
            };

            setPortfolio(updatedPortfolio);
            setError(null);

        } catch (err) {
            setError('Failed to fetch portfolio data');
            console.error('Error fetching portfolio:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Function to update price history for charts - no longer needed since updateAllPrices handles this
    // Removed updatePriceHistory function

    // Effect for initial portfolio data load
    useEffect(() => {
        fetchPortfolioData();
    }, [fetchPortfolioData]);

    // Effect for price updates every 10 seconds (only when auto-update is enabled)
    useEffect(() => {
        // Clear existing interval
        if (priceUpdateIntervalRef.current) {
            clearInterval(priceUpdateIntervalRef.current);
            priceUpdateIntervalRef.current = null;
        }

        if (!portfolio || !autoUpdateEnabled) return;

        // Set up interval to update all prices every 10 seconds
        priceUpdateIntervalRef.current = setInterval(() => {
            updateAllPrices();
        }, 10000); // 10 seconds

        // Initial price update when auto-update is enabled
        updateAllPrices();

        return () => {
            if (priceUpdateIntervalRef.current) {
                clearInterval(priceUpdateIntervalRef.current);
                priceUpdateIntervalRef.current = null;
            }
        };
    }, [portfolio?.id, autoUpdateEnabled]); // Only depend on portfolio ID and auto-update toggle

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

    if (!portfolio) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-700">No portfolio data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Portfolio Summary */}
            <PortfolioSummaryCard portfolio={portfolio} />

            {/* Holdings Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Holdings</h2>
                    <div className="flex items-center gap-4">
                        {/* Auto-update toggle */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Auto-update prices:</label>
                            <button
                                onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${autoUpdateEnabled ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoUpdateEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className="text-sm text-gray-500">
                                {autoUpdateEnabled ? 'Every 10s' : 'Disabled'}
                            </span>
                        </div>
                        <button
                            onClick={handleAddHolding}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            + Add Stock
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {portfolio.holdings.map((holding) => (
                        <HoldingCard
                            key={holding.id}
                            holding={holding}
                            onShowChart={handleShowChart}
                            onEdit={handleEditHolding}
                            onManualRefresh={handleManualRefresh}
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
                                {(selectedHolding as any).companyName || selectedHolding.symbol} ({selectedHolding.symbol})
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
                                <p className="text-lg font-bold">${((selectedHolding as any).marketValue || 0).toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Gain/Loss</p>
                                <p className={`text-lg font-bold ${((selectedHolding as any).gainLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {((selectedHolding as any).gainLoss || 0) >= 0 ? '+' : ''}${((selectedHolding as any).gainLoss || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <StockChart
                            symbol={selectedHolding.symbol}
                            companyName={(selectedHolding as any).companyName || selectedHolding.symbol}
                            priceHistory={priceHistory[selectedHolding.symbol] || []}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
