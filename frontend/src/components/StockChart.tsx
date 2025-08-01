'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockHistoryPoint } from '../../../shared/types';

interface StockChartProps {
    symbol: string;
    companyName: string;
    priceHistory: StockHistoryPoint[];
}

export default function StockChart({ symbol, companyName, priceHistory }: StockChartProps) {
    // Filter data to show only the last 10 minutes (600 seconds)
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - 10 * 60 * 1000); // Last 10 minutes
    
    const filteredHistory = priceHistory
        .filter(point => new Date(point.timestamp) >= cutoffTime)
        .slice(-60); // Keep only last 60 points (10 minutes at 10-second intervals)    // Format data for the chart
    const chartData = filteredHistory.map(point => ({
        time: new Date(point.timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        price: point.price
    }));

    const hasData = chartData.length > 0;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">{companyName} Price History (Last 10 Minutes)</h3>
            </div>

            <div className="h-64">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 10 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                            />
                            <Tooltip
                                formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
                                labelStyle={{ color: '#374151' }}
                                contentStyle={{
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <div className="text-4xl mb-2">�</div>
                            <p>Collecting price data...</p>
                            <p className="text-sm">Chart will appear as data comes in</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
                Showing {chartData.length} data points from the last 10 minutes (updates every 10 seconds)
            </div>
        </div>
    );
}
