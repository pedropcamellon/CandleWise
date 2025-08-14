import React, { useState, useEffect, useRef } from 'react';

// Types
import { PortfolioHolding, PortfolioHoldingWithUI } from '../../../shared/types';

interface HoldingCardProps {
    holding: PortfolioHoldingWithUI;
    onShowChart: (holding: PortfolioHolding) => void;
    onEdit: (holding: PortfolioHolding) => void;
    onManualRefresh: (symbol: string) => void;
}


function HoldingCard({ holding, onShowChart, onEdit, onManualRefresh }: HoldingCardProps) {
    // Calculate initial values from extended holding
    const totalCost = holding.shares * holding.averageCostBasis;
    const initialPrice = holding.currentPrice ?? holding.averageCostBasis;
    const initialMarketValue = holding.marketValue ?? totalCost;
    const initialGainLoss = holding.gainLoss ?? 0;
    const initialGainLossPercent = holding.gainLossPercent ?? 0;
    const companyName = holding.companyName ?? holding.symbol;

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

    useEffect(() => {
        const newPrice = holding.currentPrice ?? holding.averageCostBasis;
        const newMarketValue = holding.marketValue ?? holding.shares * holding.averageCostBasis;
        const newGainLoss = holding.gainLoss ?? 0;
        const newGainLossPercent = holding.gainLossPercent ?? 0;

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

export default HoldingCard;
