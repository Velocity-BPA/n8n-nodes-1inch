/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, getApiHeaders } from '../constants/endpoints';

/**
 * 1inch Price API Client
 */
export class PriceClient {
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
   * Get spot price for single token
   */
  async getSpotPrice(tokenAddress: string, currency?: string): Promise<SpotPriceResponse> {
    const response = await this.client.get(`/price/v1.1/${this.chainId}`, {
      params: {
        currency: currency || 'USD',
      },
    });
    return {
      [tokenAddress]: response.data[tokenAddress] || null,
    };
  }

  /**
   * Get spot prices for multiple tokens
   */
  async getSpotPrices(
    tokenAddresses: string[],
    currency?: string
  ): Promise<SpotPricesResponse> {
    const addresses = tokenAddresses.join(',');
    const response = await this.client.get(
      `/price/v1.1/${this.chainId}/${addresses}`,
      {
        params: {
          currency: currency || 'USD',
        },
      }
    );
    return response.data;
  }
}

/**
 * Gas Price API Client
 */
export class GasPriceClient {
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
   * Get current gas prices
   */
  async getGasPrice(): Promise<GasPriceResponse> {
    const response = await this.client.get(`/gas-price/v1.5/${this.chainId}`);
    return response.data;
  }
}

/**
 * Token API Client
 */
export class TokenClient {
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
   * Search tokens
   */
  async searchTokens(query: string, limit?: number): Promise<TokenSearchResponse> {
    const response = await this.client.get(`/token/v1.2/${this.chainId}/search`, {
      params: {
        query,
        limit: limit || 10,
      },
    });
    return response.data;
  }

  /**
   * Get token info
   */
  async getTokenInfo(address: string): Promise<TokenInfoResponse> {
    const response = await this.client.get(
      `/token/v1.2/${this.chainId}/${address}`
    );
    return response.data;
  }

  /**
   * Get custom tokens
   */
  async getCustomTokens(addresses: string[]): Promise<CustomTokensResponse> {
    const response = await this.client.post(
      `/token/v1.2/${this.chainId}/custom`,
      { addresses }
    );
    return response.data;
  }
}

/**
 * Response interfaces
 */
export interface SpotPriceResponse {
  [tokenAddress: string]: string | null;
}

export interface SpotPricesResponse {
  [tokenAddress: string]: string;
}

export interface GasPriceResponse {
  baseFee: string;
  low: GasPriceLevel;
  medium: GasPriceLevel;
  high: GasPriceLevel;
  instant: GasPriceLevel;
}

export interface GasPriceLevel {
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
}

export interface TokenSearchResponse {
  tokens: TokenDetails[];
}

export interface TokenInfoResponse extends TokenDetails {}

export interface CustomTokensResponse {
  tokens: TokenDetails[];
}

export interface TokenDetails {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  providers?: string[];
  eip2612?: boolean;
  isFoT?: boolean;
  rating?: number;
}

/**
 * Format gas price for display
 */
export function formatGasPrice(gasPriceWei: string): {
  wei: string;
  gwei: string;
  eth: string;
} {
  const wei = BigInt(gasPriceWei);
  const gwei = Number(wei) / 1e9;
  const eth = Number(wei) / 1e18;
  
  return {
    wei: wei.toString(),
    gwei: gwei.toFixed(2),
    eth: eth.toFixed(9),
  };
}

/**
 * Estimate transaction cost
 */
export function estimateTransactionCost(
  gasPrice: string,
  gasLimit: number,
  ethPrice: number
): {
  costWei: string;
  costEth: string;
  costUsd: string;
} {
  const gasPriceBigInt = BigInt(gasPrice);
  const costWei = gasPriceBigInt * BigInt(gasLimit);
  const costEth = Number(costWei) / 1e18;
  const costUsd = costEth * ethPrice;
  
  return {
    costWei: costWei.toString(),
    costEth: costEth.toFixed(6),
    costUsd: costUsd.toFixed(2),
  };
}

/**
 * Convert price between currencies
 */
export function convertPrice(
  amount: number,
  fromPrice: number,
  toPrice: number
): number {
  if (toPrice === 0) return 0;
  return (amount * fromPrice) / toPrice;
}
