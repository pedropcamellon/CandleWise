import React, { useState, useEffect } from 'react';

// Types
import { Portfolio } from '../../../shared/types';

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

export default PortfolioSummaryCard;
