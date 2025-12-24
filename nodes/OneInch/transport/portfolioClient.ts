/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, getApiHeaders } from '../constants/endpoints';

/**
 * 1inch Portfolio API Client
 */
export class PortfolioClient {
  private client: AxiosInstance;

  constructor(apiKey?: string) {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: getApiHeaders(apiKey),
      timeout: 30000,
    });
  }

  /**
   * Get portfolio value and profit/loss
   */
  async getProfitAndLoss(params: {
    addresses: string[];
    chainId?: number;
  }): Promise<PortfolioProfitLossResponse> {
    const response = await this.client.get(
      '/portfolio/portfolio/v4/overview/erc20/profit_and_loss',
      {
        params: {
          addresses: params.addresses.join(','),
          chain_id: params.chainId,
        },
      }
    );
    return response.data;
  }

  /**
   * Get portfolio details
   */
  async getDetails(params: {
    addresses: string[];
    chainId?: number;
  }): Promise<PortfolioDetailsResponse> {
    const response = await this.client.get(
      '/portfolio/portfolio/v4/overview/erc20/details',
      {
        params: {
          addresses: params.addresses.join(','),
          chain_id: params.chainId,
        },
      }
    );
    return response.data;
  }

  /**
   * Get current portfolio value
   */
  async getCurrentValue(params: {
    addresses: string[];
    chainId?: number;
  }): Promise<PortfolioCurrentValueResponse> {
    const response = await this.client.get(
      '/portfolio/portfolio/v4/overview/erc20/current_value',
      {
        params: {
          addresses: params.addresses.join(','),
          chain_id: params.chainId,
        },
      }
    );
    return response.data;
  }

  /**
   * Get supported chains for portfolio
   */
  async getSupportedChains(): Promise<PortfolioSupportedChainsResponse> {
    const response = await this.client.get(
      '/portfolio/portfolio/v4/general/supported_chains'
    );
    return response.data;
  }
}

/**
 * Balance API Client
 */
export class BalanceClient {
  private client: AxiosInstance;
  private chainId: number;

  constructor(chainId: number, apiKey?: string) {
    this.chainId = chainId;
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: getApiHeaders(apiKey),
      timeout: 30000,
    });
  }

  /**
   * Get all token balances for address
   */
  async getBalances(address: string): Promise<BalancesResponse> {
    const response = await this.client.get(
      `/balance/v1.2/${this.chainId}/balances/${address}`
    );
    return response.data;
  }

  /**
   * Get specific token balance
   */
  async getBalance(
    address: string,
    tokenAddress: string
  ): Promise<BalanceResponse> {
    const response = await this.client.get(
      `/balance/v1.2/${this.chainId}/balance/${address}/${tokenAddress}`
    );
    return response.data;
  }
}

/**
 * Response interfaces
 */
export interface PortfolioProfitLossResponse {
  result: PortfolioProfitLoss[];
}

export interface PortfolioProfitLoss {
  chain_id: number;
  address: string;
  abs_profit_usd: number;
  roi: number;
  pnl: PortfolioPnL;
}

export interface PortfolioPnL {
  total_pnl_usd: number;
  total_cost_basis_usd: number;
  total_current_value_usd: number;
  realized_pnl_usd: number;
  unrealized_pnl_usd: number;
}

export interface PortfolioDetailsResponse {
  result: PortfolioTokenDetail[];
}

export interface PortfolioTokenDetail {
  chain_id: number;
  token_address: string;
  token_symbol: string;
  token_name: string;
  token_decimals: number;
  token_logo_url?: string;
  balance: string;
  balance_usd: number;
  price_usd: number;
  price_change_24h_percent?: number;
  cost_basis_usd?: number;
  pnl_usd?: number;
  roi_percent?: number;
}

export interface PortfolioCurrentValueResponse {
  result: PortfolioValue[];
}

export interface PortfolioValue {
  chain_id: number;
  address: string;
  value_usd: number;
}

export interface PortfolioSupportedChainsResponse {
  result: SupportedChain[];
}

export interface SupportedChain {
  chain_id: number;
  chain_name: string;
  chain_symbol: string;
}

export interface BalancesResponse {
  [tokenAddress: string]: string;
}

export interface BalanceResponse {
  balance: string;
}

/**
 * Calculate portfolio metrics
 */
export function calculatePortfolioMetrics(details: PortfolioTokenDetail[]): PortfolioMetrics {
  let totalValue = 0;
  let totalCostBasis = 0;
  let totalPnl = 0;
  const tokens: Record<string, number> = {};
  
  for (const token of details) {
    totalValue += token.balance_usd || 0;
    totalCostBasis += token.cost_basis_usd || 0;
    totalPnl += token.pnl_usd || 0;
    tokens[token.token_symbol] = token.balance_usd || 0;
  }
  
  const roi = totalCostBasis > 0 ? (totalPnl / totalCostBasis) * 100 : 0;
  
  // Calculate allocations
  const allocations: PortfolioAllocation[] = Object.entries(tokens)
    .map(([symbol, value]) => ({
      symbol,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
  
  return {
    totalValue,
    totalCostBasis,
    totalPnl,
    roi,
    tokenCount: details.length,
    allocations,
  };
}

export interface PortfolioMetrics {
  totalValue: number;
  totalCostBasis: number;
  totalPnl: number;
  roi: number;
  tokenCount: number;
  allocations: PortfolioAllocation[];
}

export interface PortfolioAllocation {
  symbol: string;
  value: number;
  percentage: number;
}
