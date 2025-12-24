/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, getApiHeaders } from '../constants/endpoints';

/**
 * 1inch Fusion API Client for gasless swaps
 */
export class FusionClient {
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
   * Get Fusion quote
   */
  async getQuote(params: {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: string;
    walletAddress: string;
    enableEstimate?: boolean;
    fee?: number;
    isPermit2?: boolean;
  }): Promise<FusionQuoteResponse> {
    const response = await this.client.get(
      `/fusion/quoter/v2.0/${this.chainId}/quote/receive`,
      { params }
    );
    return response.data;
  }

  /**
   * Get all available quotes
   */
  async getAllQuotes(params: {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: string;
    walletAddress: string;
  }): Promise<FusionQuoteAllResponse> {
    const response = await this.client.get(
      `/fusion/quoter/v2.0/${this.chainId}/quote/all`,
      { params }
    );
    return response.data;
  }

  /**
   * Get ready to accept quote
   */
  async getReadyToAccept(params: {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: string;
    walletAddress: string;
  }): Promise<FusionReadyToAcceptResponse> {
    const response = await this.client.get(
      `/fusion/quoter/v2.0/${this.chainId}/quote/ready-to-accept`,
      { params }
    );
    return response.data;
  }

  /**
   * Submit Fusion order
   */
  async submitOrder(order: FusionOrderRequest): Promise<FusionOrderResponse> {
    const response = await this.client.post(
      `/fusion/relayer/v2.0/${this.chainId}/order`,
      order
    );
    return response.data;
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderHash: string): Promise<FusionOrderStatusResponse> {
    const response = await this.client.get(
      `/fusion/relayer/v2.0/${this.chainId}/order/status/${orderHash}`
    );
    return response.data;
  }

  /**
   * Get orders by maker address
   */
  async getOrdersByMaker(
    address: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<FusionOrdersResponse> {
    const response = await this.client.get(
      `/fusion/relayer/v2.0/${this.chainId}/order/maker/${address}`,
      { params }
    );
    return response.data;
  }

  /**
   * Get active orders
   */
  async getActiveOrders(params?: {
    page?: number;
    limit?: number;
  }): Promise<FusionOrdersResponse> {
    const response = await this.client.get(
      `/fusion/relayer/v2.0/${this.chainId}/order/active`,
      { params }
    );
    return response.data;
  }

  /**
   * Get resolvers
   */
  async getResolvers(): Promise<FusionResolversResponse> {
    const response = await this.client.get(
      `/fusion/resolver/v1.0/${this.chainId}/resolvers`
    );
    return response.data;
  }
}

/**
 * Fusion+ (Cross-chain) Client
 */
export class FusionPlusClient {
  private client: AxiosInstance;

  constructor(apiKey?: string) {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: getApiHeaders(apiKey),
      timeout: 30000,
    });
  }

  /**
   * Get cross-chain quote
   */
  async getQuote(params: {
    srcChain: number;
    dstChain: number;
    srcTokenAddress: string;
    dstTokenAddress: string;
    amount: string;
    walletAddress: string;
  }): Promise<FusionPlusQuoteResponse> {
    const response = await this.client.get(
      '/fusion-plus/quoter/v1.0/quote/receive',
      { params }
    );
    return response.data;
  }

  /**
   * Submit cross-chain order
   */
  async submitOrder(order: FusionPlusOrderRequest): Promise<FusionPlusOrderResponse> {
    const response = await this.client.post('/fusion-plus/relayer/v1.0/order', order);
    return response.data;
  }

  /**
   * Get cross-chain order status
   */
  async getOrderStatus(orderHash: string): Promise<FusionPlusOrderStatusResponse> {
    const response = await this.client.get(
      `/fusion-plus/relayer/v1.0/order/status/${orderHash}`
    );
    return response.data;
  }
}

/**
 * Response interfaces
 */
export interface FusionQuoteResponse {
  quoteId: string;
  fromTokenAmount: string;
  toTokenAmount: string;
  feeToken: string;
  estimatedGas: number;
  presets: FusionPreset[];
  recommendedPreset: string;
  settlementAddress: string;
  whitelist: string[];
}

export interface FusionQuoteAllResponse {
  quotes: FusionQuoteResponse[];
}

export interface FusionReadyToAcceptResponse {
  ready: boolean;
  reason?: string;
}

export interface FusionPreset {
  auctionDuration: number;
  startAuctionIn: number;
  initialRateBump: number;
  auctionStartAmount: string;
  auctionEndAmount: string;
  points: FusionAuctionPoint[];
}

export interface FusionAuctionPoint {
  delay: number;
  coefficient: number;
}

export interface FusionOrderRequest {
  order: {
    salt: string;
    maker: string;
    receiver: string;
    makerAsset: string;
    takerAsset: string;
    makingAmount: string;
    takingAmount: string;
    makerTraits: string;
  };
  signature: string;
  quoteId: string;
}

export interface FusionOrderResponse {
  orderHash: string;
  order: FusionOrder;
}

export interface FusionOrder {
  salt: string;
  maker: string;
  receiver: string;
  makerAsset: string;
  takerAsset: string;
  makingAmount: string;
  takingAmount: string;
  makerTraits: string;
}

export interface FusionOrderStatusResponse {
  status: FusionOrderStatus;
  order: FusionOrder;
  points?: number;
  fills: FusionFill[];
  auctionStartTime: number;
  auctionDuration: number;
  initialRateBump: number;
  cancelTx?: string;
}

export type FusionOrderStatus =
  | 'pending'
  | 'filled'
  | 'partially-filled'
  | 'cancelled'
  | 'expired';

export interface FusionFill {
  txHash: string;
  filledMakerAmount: string;
  filledTakerAmount: string;
}

export interface FusionOrdersResponse {
  orders: FusionOrderStatusResponse[];
  meta: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  };
}

export interface FusionResolversResponse {
  resolvers: FusionResolver[];
}

export interface FusionResolver {
  address: string;
  name: string;
  priority: number;
  whitelist: boolean;
}

export interface FusionPlusQuoteResponse {
  quoteId: string;
  srcChainId: number;
  dstChainId: number;
  srcTokenAmount: string;
  dstTokenAmount: string;
  estimatedTime: number;
  bridgeFee: string;
}

export interface FusionPlusOrderRequest {
  srcOrder: FusionOrderRequest;
  dstChainId: number;
}

export interface FusionPlusOrderResponse {
  orderHash: string;
  srcOrderHash: string;
}

export interface FusionPlusOrderStatusResponse {
  status: FusionOrderStatus;
  srcChainStatus: FusionOrderStatusResponse;
  dstChainStatus?: FusionOrderStatusResponse;
  bridgeStatus?: 'pending' | 'completed' | 'failed';
}
