/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, getApiHeaders } from '../constants/endpoints';

/**
 * 1inch Aggregation API Client
 */
export class AggregationClient {
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
   * Get swap quote
   */
  async getQuote(params: {
    src: string;
    dst: string;
    amount: string;
    fee?: number;
    protocols?: string;
    gasPrice?: string;
    complexityLevel?: number;
    connectorTokens?: string;
    gasLimit?: number;
    includeTokensInfo?: boolean;
    includeProtocols?: boolean;
    includeGas?: boolean;
  }): Promise<QuoteResponse> {
    const response = await this.client.get(`/swap/v6.0/${this.chainId}/quote`, {
      params,
    });
    return response.data;
  }

  /**
   * Get swap calldata
   */
  async getSwap(params: {
    src: string;
    dst: string;
    amount: string;
    from: string;
    slippage: number;
    fee?: number;
    protocols?: string;
    gasPrice?: string;
    complexityLevel?: number;
    connectorTokens?: string;
    gasLimit?: number;
    receiver?: string;
    referrer?: string;
    disableEstimate?: boolean;
    permit?: string;
    includeTokensInfo?: boolean;
    includeProtocols?: boolean;
    includeGas?: boolean;
  }): Promise<SwapResponse> {
    const response = await this.client.get(`/swap/v6.0/${this.chainId}/swap`, {
      params,
    });
    return response.data;
  }

  /**
   * Get approval transaction data
   */
  async getApproveTransaction(params: {
    tokenAddress: string;
    amount?: string;
  }): Promise<ApproveTransactionResponse> {
    const response = await this.client.get(
      `/swap/v6.0/${this.chainId}/approve/transaction`,
      { params }
    );
    return response.data;
  }

  /**
   * Get current allowance
   */
  async getAllowance(params: {
    tokenAddress: string;
    walletAddress: string;
  }): Promise<AllowanceResponse> {
    const response = await this.client.get(
      `/swap/v6.0/${this.chainId}/approve/allowance`,
      { params }
    );
    return response.data;
  }

  /**
   * Get spender address (router)
   */
  async getSpender(): Promise<SpenderResponse> {
    const response = await this.client.get(
      `/swap/v6.0/${this.chainId}/approve/spender`
    );
    return response.data;
  }

  /**
   * Get liquidity sources
   */
  async getLiquiditySources(): Promise<LiquiditySourcesResponse> {
    const response = await this.client.get(
      `/swap/v6.0/${this.chainId}/liquidity-sources`
    );
    return response.data;
  }

  /**
   * Get supported tokens
   */
  async getTokens(): Promise<TokensResponse> {
    const response = await this.client.get(`/swap/v6.0/${this.chainId}/tokens`);
    return response.data;
  }

  /**
   * Handle API errors
   */
  static handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ description?: string; error?: string }>;
      const message =
        axiosError.response?.data?.description ||
        axiosError.response?.data?.error ||
        axiosError.message;
      throw new Error(`1inch API Error: ${message}`);
    }
    throw error;
  }
}

/**
 * Response interfaces
 */
export interface QuoteResponse {
  dstAmount: string;
  srcToken: TokenInfo;
  dstToken: TokenInfo;
  protocols: Protocol[][][];
  gas: number;
}

export interface SwapResponse {
  dstAmount: string;
  srcToken: TokenInfo;
  dstToken: TokenInfo;
  protocols: Protocol[][][];
  tx: TransactionData;
}

export interface ApproveTransactionResponse {
  data: string;
  gasPrice: string;
  to: string;
  value: string;
}

export interface AllowanceResponse {
  allowance: string;
}

export interface SpenderResponse {
  address: string;
}

export interface LiquiditySourcesResponse {
  protocols: LiquiditySource[];
}

export interface TokensResponse {
  tokens: Record<string, TokenInfo>;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI?: string;
  tags?: string[];
}

export interface Protocol {
  name: string;
  part: number;
  fromTokenAddress: string;
  toTokenAddress: string;
}

export interface TransactionData {
  from: string;
  to: string;
  data: string;
  value: string;
  gas: number;
  gasPrice: string;
}

export interface LiquiditySource {
  id: string;
  title: string;
  img: string;
  img_color: string;
}
