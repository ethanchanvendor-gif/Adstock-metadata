import axios from 'axios';

export interface TokenInsight {
  marketMomentum: 'bullish' | 'bearish' | 'neutral';
  liquidityScore: number;
  volatilityRisk: 'low' | 'medium' | 'high';
  holderDistribution: 'centralized' | 'balanced' | 'distributed';
  transactionVelocity: 'slow' | 'active' | 'highly_active';
  trustIndicators: string[];
  riskWarnings: string[];
  recommendations: string[];
}

export async function generateTokenInsights(metadata: any, transactions: any[], holders: number): Promise<TokenInsight> {
  const insights: TokenInsight = {
    marketMomentum: 'neutral',
    liquidityScore: 50,
    volatilityRisk: 'medium',
    holderDistribution: 'balanced',
    transactionVelocity: 'active',
    trustIndicators: [],
    riskWarnings: [],
    recommendations: [],
  };

  // Analyze transaction velocity
  const recentTxCount = transactions.filter(tx => {
    const age = Date.now() - tx.timestamp;
    return age < 24 * 60 * 60 * 1000; // Last 24 hours
  }).length;

  if (recentTxCount > 100) {
    insights.transactionVelocity = 'highly_active';
    insights.marketMomentum = 'bullish';
  } else if (recentTxCount > 20) {
    insights.transactionVelocity = 'active';
  } else {
    insights.transactionVelocity = 'slow';
    insights.marketMomentum = 'bearish';
  }

  // Calculate liquidity score
  const txSuccessRate = transactions.filter(tx => tx.type === 'success').length / Math.max(transactions.length, 1);
  insights.liquidityScore = Math.round(txSuccessRate * 100);

  // Analyze holder distribution
  if (holders < 10) {
    insights.holderDistribution = 'centralized';
    insights.riskWarnings.push('Low holder count indicates centralization risk');
  } else if (holders < 50) {
    insights.holderDistribution = 'balanced';
  } else {
    insights.holderDistribution = 'distributed';
    insights.trustIndicators.push('Good holder distribution');
  }

  // Volatility assessment
  if (insights.transactionVelocity === 'slow') {
    insights.volatilityRisk = 'high';
    insights.riskWarnings.push('Low transaction volume indicates potential liquidity issues');
  } else if (insights.transactionVelocity === 'highly_active') {
    insights.volatilityRisk = 'low';
  }

  // Trust indicators
  if (metadata.mintAuthority === null) {
    insights.trustIndicators.push('Mint authority revoked - supply is fixed');
  } else {
    insights.riskWarnings.push('Mint authority active - supply can be increased');
  }

  if (metadata.freezeAuthority === null) {
    insights.trustIndicators.push('Freeze authority revoked - tokens cannot be frozen');
  } else {
    insights.riskWarnings.push('Freeze authority active - tokens can be frozen');
  }

  // Recommendations
  if (insights.trustIndicators.length >= 2) {
    insights.recommendations.push('Token shows strong transparency indicators - safe for long-term holding');
  }
  if (insights.riskWarnings.length > 0) {
    insights.recommendations.push('Review risk warnings before making investment decisions');
  }
  if (holders < 100) {
    insights.recommendations.push('Wait for more organic adoption before significant investment');
  }
  if (insights.liquidityScore < 70) {
    insights.recommendations.push('Low transaction success rate - check for liquidity issues');
  }

  return insights;
}

export async function analyzeTokenHealth(metadata: any): Promise<string[]> {
  const healthChecks: string[] = [];

  if (metadata.name && metadata.symbol) {
    healthChecks.push('✓ Metadata complete');
  } else {
    healthChecks.push('✗ Incomplete metadata');
  }

  if (metadata.uri) {
    healthChecks.push('✓ Logo/URI present');
  }

  return healthChecks;
}

export default {
  generateTokenInsights,
  analyzeTokenHealth,
};