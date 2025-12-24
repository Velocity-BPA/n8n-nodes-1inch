/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, getApiHeaders } from '../constants/endpoints';

/**
 * 1inch Limit Order Protocol API Client
 */
export class LimitOrderClient {
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
   * Create limit order
   */
  async createOrder(order: LimitOrderRequest): Promise<LimitOrderResponse> {
    const response = await this.client.post(
      `/orderbook/v4.0/${this.chainId}/`,
      order
    );
    return response.data;
  }

  /**
   * Get all orders
   */
  async getAllOrders(params?: {
    page?: number;
    limit?: number;
    sortBy?: 'createDateTime' | 'takerRate' | 'makerRate';
    takerAsset?: string;
    makerAsset?: string;
  }): Promise<LimitOrdersResponse> {
    const response = await this.client.get(
      `/orderbook/v4.0/${this.chainId}/all`,
      { params }
    );
    return response.data;
  }

  /**
   * Get order count
   */
  async getOrderCount(params?: {
    statuses?: string;
  }): Promise<LimitOrderCountResponse> {
    const response = await this.client.get(
      `/orderbook/v4.0/${this.chainId}/count`,
      { params }
    );
    return response.data;
  }

  /**
   * Get orders by address
   */
  async getOrdersByAddress(
    address: string,
    params?: {
      page?: number;
      limit?: number;
      statuses?: string;
    }
  ): Promise<LimitOrdersResponse> {
    const response = await this.client.get(
      `/orderbook/v4.0/${this.chainId}/address/${address}`,
      { params }
    );
    return response.data;
  }

  /**
   * Get order events
   */
  async getOrderEvents(params?: {
    limit?: number;
  }): Promise<LimitOrderEventsResponse> {
    const response = await this.client.get(
      `/orderbook/v4.0/${this.chainId}/events`,
      { params }
    );
    return response.data;
  }

  /**
   * Get events for specific order
   */
  async getOrderEventsByHash(orderHash: string): Promise<LimitOrderEventsResponse> {
    const response = await this.client.get(
      `/orderbook/v4.0/${this.chainId}/events/${orderHash}`
    );
    return response.data;
  }

  /**
   * Check if address has active orders with permit
   */
  async hasActiveOrdersWithPermit(
    walletAddress: string,
    tokenAddress: string
  ): Promise<HasActiveOrdersResponse> {
    const response = await this.client.get(
      `/orderbook/v4.0/${this.chainId}/has-active-orders-with-permit/${walletAddress}/${tokenAddress}`
    );
    return response.data;
  }
}

/**
 * Request/Response interfaces
 */
export interface LimitOrderRequest {
  orderHash: string;
  signature: string;
  data: LimitOrderData;
}

export interface LimitOrderData {
  makerAsset: string;
  takerAsset: string;
  maker: string;
  receiver: string;
  makingAmount: string;
  takingAmount: string;
  salt: string;
  makerTraits: string;
}

export interface LimitOrderResponse {
  success: boolean;
  orderHash?: string;
  error?: string;
}

export interface LimitOrder {
  orderHash: string;
  signature: string;
  createDateTime: string;
  remainingMakerAmount: string;
  makerBalance: string;
  makerAllowance: string;
  data: LimitOrderData;
  makerRate: string;
  takerRate: string;
  isMakerContract: boolean;
  orderInvalidReason: string | null;
}

export interface LimitOrdersResponse {
  items: LimitOrder[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface LimitOrderCountResponse {
  count: number;
}

export interface LimitOrderEvent {
  id: number;
  orderHash: string;
  type: 'OrderCreated' | 'OrderFilled' | 'OrderCanceled' | 'OrderExpired';
  createDateTime: string;
  transactionHash?: string;
  maker?: string;
  taker?: string;
  makerAmount?: string;
  takerAmount?: string;
  remainingMakerAmount?: string;
}

export interface LimitOrderEventsResponse {
  items: LimitOrderEvent[];
}

export interface HasActiveOrdersResponse {
  hasActiveOrders: boolean;
}

/**
 * Build limit order struct
 */
export interface LimitOrderParams {
  makerAsset: string;
  takerAsset: string;
  maker: string;
  receiver?: string;
  makingAmount: string;
  takingAmount: string;
  expiry?: number;
}

export function buildLimitOrderStruct(params: LimitOrderParams): LimitOrderData {
  const receiver = params.receiver || params.maker;
  const salt = generateSalt();
  const makerTraits = buildMakerTraits(params.expiry);
  
  return {
    makerAsset: params.makerAsset,
    takerAsset: params.takerAsset,
    maker: params.maker,
    receiver,
    makingAmount: params.makingAmount,
    takingAmount: params.takingAmount,
    salt,
    makerTraits,
  };
}

/**
 * Generate random salt for order
 */
export function generateSalt(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return '0x' + Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Build maker traits (includes expiry, nonce, etc.)
 */
export function buildMakerTraits(expiry?: number): string {
  // Simplified maker traits - in production would encode more data
  if (expiry) {
    return '0x' + expiry.toString(16).padStart(64, '0');
  }
  return '0x' + '0'.repeat(64);
}

/**
 * Calculate order rates
 */
export function calculateOrderRate(
  makingAmount: string,
  takingAmount: string,
  makerDecimals: number,
  takerDecimals: number
): { makerRate: number; takerRate: number } {
  const making = parseFloat(makingAmount) / Math.pow(10, makerDecimals);
  const taking = parseFloat(takingAmount) / Math.pow(10, takerDecimals);
  
  return {
    makerRate: taking / making,
    takerRate: making / taking,
  };
}
