import React from 'react';
import { useTokenStore } from '../stores/tokenStore';

function Insights() {
  const { insights } = useTokenStore();

  if (!insights) {
    return <div className="text-gray-400">Loading insights...</div>;
  }

  const getMomentumColor = (momentum: string) => {
    switch (momentum) {
      case 'bullish':
        return 'text-green-400 bg-green-900/20';
      case 'bearish':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getVelocityEmoji = (velocity: string) => {
    switch (velocity) {
      case 'highly_active':
        return '🔥';
      case 'active':
        return '⚡';
      default:
        return '🐢';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Market Momentum */}
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Market Momentum</div>
          <div className={`text-2xl font-bold capitalize px-3 py-2 rounded ${getMomentumColor(insights.marketMomentum)}`}>
            {insights.marketMomentum}
          </div>
        </div>

        {/* Liquidity Score */}
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Liquidity Score</div>
          <div className="text-3xl font-bold text-green-400">{insights.liquidityScore}%</div>
          <div className="text-xs text-gray-500 mt-1">Transaction Success</div>
        </div>

        {/* Volatility Risk */}
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Volatility Risk</div>
          <div className={`text-lg font-bold capitalize ${getRiskColor(insights.volatilityRisk)}`}>
            {insights.volatilityRisk}
          </div>
        </div>

        {/* Transaction Velocity */}
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Activity Level</div>
          <div className="text-2xl">{getVelocityEmoji(insights.transactionVelocity)}</div>
          <div className="text-xs text-gray-500 mt-2 capitalize">{insights.transactionVelocity.replace('_', ' ')}</div>
        </div>
      </div>

      {/* Holder Distribution */}
      <div className="border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Holder Distribution</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl font-bold capitalize ${
              insights.holderDistribution === 'distributed'
                ? 'text-green-400'
                : insights.holderDistribution === 'balanced'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}>
              {insights.holderDistribution}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {insights.holderDistribution === 'distributed'
                ? 'Healthy distribution across many holders'
                : insights.holderDistribution === 'balanced'
                ? 'Moderate concentration, acceptable level'
                : 'High concentration risk - few major holders'}
            </div>
          </div>
          <div className="text-4xl opacity-30">📊</div>
        </div>
      </div>

      {/* Trust Indicators */}
      {insights.trustIndicators.length > 0 && (
        <div className="border border-green-900/50 bg-green-900/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-400">✓ Trust Indicators</h3>
          <div className="space-y-2">
            {insights.trustIndicators.map((indicator: string, idx: number) => (
              <div key={idx} className="flex gap-2 text-sm text-green-300">
                <span className="text-green-400 font-bold">✓</span>
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Warnings */}
      {insights.riskWarnings.length > 0 && (
        <div className="border border-red-900/50 bg-red-900/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-400">⚠️ Risk Warnings</h3>
          <div className="space-y-2">
            {insights.riskWarnings.map((warning: string, idx: number) => (
              <div key={idx} className="flex gap-2 text-sm text-red-300">
                <span className="text-red-400 font-bold">⚠️</span>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {insights.recommendations.length > 0 && (
        <div className="border border-yellow-900/50 bg-yellow-900/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">💡 Recommendations</h3>
          <div className="space-y-2">
            {insights.recommendations.map((rec: string, idx: number) => (
              <div key={idx} className="flex gap-2 text-sm text-yellow-300">
                <span className="text-yellow-400 font-bold">→</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Insights;