/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Price-related utility functions for 1inch operations
 */

/**
 * Token price information
 */
export interface TokenPrice {
  address: string;
  price: number;
  priceUsd?: number;
  change24h?: number;
}

/**
 * Format price with appropriate precision
 */
export function formatPrice(price: number, precision: number = 6): string {
  if (price === 0) return '0';
  
  if (price >= 1) {
    return price.toFixed(Math.min(precision, 2));
  }
  
  // For small numbers, show more decimals
  const magnitude = Math.floor(Math.log10(Math.abs(price)));
  const decimals = Math.min(Math.max(-magnitude + 2, 2), 18);
  return price.toFixed(decimals);
}

/**
 * Calculate USD value
 */
export function calculateUsdValue(
  amount: string | number,
  decimals: number,
  priceUsd: number
): number {
  const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
  const normalizedAmount = amountNum / Math.pow(10, decimals);
  return normalizedAmount * priceUsd;
}

/**
 * Format USD value
 */
export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Calculate exchange rate between two tokens
 */
export function calculateExchangeRate(
  token1Price: number,
  token2Price: number
): number {
  if (token2Price === 0) return 0;
  return token1Price / token2Price;
}

/**
 * Calculate arbitrage opportunity
 */
export interface ArbitrageOpportunity {
  exists: boolean;
  percentageDiff: number;
  direction: 'buy' | 'sell';
  estimatedProfit: number;
}

export function calculateArbitrageOpportunity(
  price1: number,
  price2: number,
  amount: number,
  minProfitPercent: number = 0.5
): ArbitrageOpportunity {
  const percentageDiff = Math.abs(((price1 - price2) / price1) * 100);
  const exists = percentageDiff >= minProfitPercent;
  const direction = price1 > price2 ? 'buy' : 'sell';
  const estimatedProfit = exists ? amount * (percentageDiff / 100) : 0;
  
  return {
    exists,
    percentageDiff,
    direction,
    estimatedProfit,
  };
}

/**
 * Calculate TWAP (Time-Weighted Average Price)
 */
export function calculateTWAP(prices: { price: number; timestamp: number }[]): number {
  if (prices.length < 2) {
    return prices.length === 1 ? prices[0].price : 0;
  }
  
  let weightedSum = 0;
  let totalTime = 0;
  
  for (let i = 1; i < prices.length; i++) {
    const timeDiff = prices[i].timestamp - prices[i - 1].timestamp;
    const avgPrice = (prices[i].price + prices[i - 1].price) / 2;
    weightedSum += avgPrice * timeDiff;
    totalTime += timeDiff;
  }
  
  return totalTime > 0 ? weightedSum / totalTime : 0;
}

/**
 * Calculate VWAP (Volume-Weighted Average Price)
 */
export function calculateVWAP(trades: { price: number; volume: number }[]): number {
  if (trades.length === 0) return 0;
  
  let priceVolumeSum = 0;
  let totalVolume = 0;
  
  for (const trade of trades) {
    priceVolumeSum += trade.price * trade.volume;
    totalVolume += trade.volume;
  }
  
  return totalVolume > 0 ? priceVolumeSum / totalVolume : 0;
}

/**
 * Calculate price confidence based on liquidity depth
 */
export function calculatePriceConfidence(
  bidPrice: number,
  askPrice: number,
  depth: number
): number {
  if (bidPrice === 0 || askPrice === 0) return 0;
  
  const spread = ((askPrice - bidPrice) / bidPrice) * 100;
  const spreadFactor = Math.max(0, 1 - spread / 10);
  const depthFactor = Math.min(1, depth / 1000000);
  
  return (spreadFactor * 0.7 + depthFactor * 0.3) * 100;
}

/**
 * Check if price is stale
 */
export function isPriceStale(
  lastUpdateTimestamp: number,
  maxAgeSeconds: number = 300
): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now - lastUpdateTimestamp > maxAgeSeconds;
}

/**
 * Normalize price to standard decimals
 */
export function normalizePrice(
  price: string | number,
  fromDecimals: number,
  toDecimals: number = 18
): string {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  const factor = Math.pow(10, toDecimals - fromDecimals);
  return (priceNum * factor).toFixed(0);
}
