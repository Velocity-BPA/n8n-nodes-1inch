/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * 1inch API Endpoints and Configuration
 */

/**
 * Base API URLs
 */
export const API_BASE_URL = 'https://api.1inch.dev';
export const API_LEGACY_URL = 'https://api.1inch.io';
export const FUSION_API_URL = 'https://api.1inch.dev/fusion';
export const PORTFOLIO_API_URL = 'https://api.1inch.dev/portfolio';
export const PRICE_API_URL = 'https://api.1inch.dev/price';

/**
 * API Version
 */
export const API_VERSION = 'v6.0';

/**
 * Endpoint paths
 */
export const ENDPOINTS = {
  // Swap endpoints
  SWAP: {
    QUOTE: '/swap/v6.0/{chainId}/quote',
    SWAP: '/swap/v6.0/{chainId}/swap',
    APPROVE_TRANSACTION: '/swap/v6.0/{chainId}/approve/transaction',
    APPROVE_ALLOWANCE: '/swap/v6.0/{chainId}/approve/allowance',
    APPROVE_SPENDER: '/swap/v6.0/{chainId}/approve/spender',
    LIQUIDITY_SOURCES: '/swap/v6.0/{chainId}/liquidity-sources',
    TOKENS: '/swap/v6.0/{chainId}/tokens',
  },
  
  // Fusion endpoints
  FUSION: {
    QUOTE: '/fusion/quoter/v2.0/{chainId}/quote/receive',
    QUOTE_ALL: '/fusion/quoter/v2.0/{chainId}/quote/all',
    ORDER: '/fusion/relayer/v2.0/{chainId}/order',
    ORDER_STATUS: '/fusion/relayer/v2.0/{chainId}/order/status/{orderHash}',
    ORDERS_BY_MAKER: '/fusion/relayer/v2.0/{chainId}/order/maker/{address}',
    ACTIVE_ORDERS: '/fusion/relayer/v2.0/{chainId}/order/active',
    RESOLVERS: '/fusion/resolver/v1.0/{chainId}/resolvers',
    READY_TO_ACCEPT: '/fusion/quoter/v2.0/{chainId}/quote/ready-to-accept',
  },
  
  // Fusion+ (Cross-chain) endpoints
  FUSION_PLUS: {
    QUOTE: '/fusion-plus/quoter/v1.0/quote/receive',
    ORDER: '/fusion-plus/relayer/v1.0/order',
    ORDER_STATUS: '/fusion-plus/relayer/v1.0/order/status/{orderHash}',
  },
  
  // Limit Order endpoints
  LIMIT_ORDER: {
    ALL: '/orderbook/v4.0/{chainId}/all',
    COUNT: '/orderbook/v4.0/{chainId}/count',
    EVENTS: '/orderbook/v4.0/{chainId}/events',
    EVENTS_BY_ORDER: '/orderbook/v4.0/{chainId}/events/{orderHash}',
    HAS_ACTIVE_ORDERS: '/orderbook/v4.0/{chainId}/has-active-orders-with-permit/{walletAddress}/{tokenAddress}',
    ORDER: '/orderbook/v4.0/{chainId}/',
    ORDERS_BY_ADDRESS: '/orderbook/v4.0/{chainId}/address/{address}',
  },
  
  // Price endpoints
  PRICE: {
    SPOT: '/price/v1.1/{chainId}',
    SPOT_MULTI: '/price/v1.1/{chainId}/{addresses}',
  },
  
  // Token endpoints
  TOKEN: {
    SEARCH: '/token/v1.2/{chainId}/search',
    INFO: '/token/v1.2/{chainId}/{address}',
    CUSTOM: '/token/v1.2/{chainId}/custom',
  },
  
  // Portfolio endpoints
  PORTFOLIO: {
    VALUE: '/portfolio/portfolio/v4/overview/erc20/profit_and_loss',
    DETAILS: '/portfolio/portfolio/v4/overview/erc20/details',
    CURRENT_VALUE: '/portfolio/portfolio/v4/overview/erc20/current_value',
    CHAINS: '/portfolio/portfolio/v4/general/supported_chains',
  },
  
  // Balance endpoints
  BALANCE: {
    BALANCES: '/balance/v1.2/{chainId}/balances/{address}',
    BALANCE: '/balance/v1.2/{chainId}/balance/{address}/{tokenAddress}',
  },
  
  // Gas endpoints
  GAS: {
    PRICE: '/gas-price/v1.5/{chainId}',
  },
  
  // Approve endpoints
  APPROVE: {
    TRANSACTION: '/swap/v6.0/{chainId}/approve/transaction',
    ALLOWANCE: '/swap/v6.0/{chainId}/approve/allowance',
    SPENDER: '/swap/v6.0/{chainId}/approve/spender',
  },
  
  // Health check endpoints
  HEALTH: {
    STATUS: '/healthcheck',
  },
  
  // Referral endpoints
  REFERRAL: {
    INFO: '/referral/v1.0/info',
    STATS: '/referral/v1.0/stats',
  },
  
  // Staking endpoints (Ethereum only)
  STAKING: {
    INFO: '/staking/v1.0/info',
    BALANCE: '/staking/v1.0/balance/{address}',
    REWARDS: '/staking/v1.0/rewards/{address}',
  },
  
  // Governance endpoints (Ethereum only)
  GOVERNANCE: {
    PROPOSALS: '/governance/v1.0/proposals',
    PROPOSAL: '/governance/v1.0/proposals/{proposalId}',
    VOTES: '/governance/v1.0/votes/{address}',
  },
};

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  FREE: {
    requestsPerSecond: 1,
    requestsPerMinute: 30,
  },
  BASIC: {
    requestsPerSecond: 5,
    requestsPerMinute: 200,
  },
  PRO: {
    requestsPerSecond: 20,
    requestsPerMinute: 1000,
  },
  ENTERPRISE: {
    requestsPerSecond: 100,
    requestsPerMinute: 5000,
  },
};

/**
 * Build endpoint URL with chain ID
 */
export function buildEndpointUrl(
  endpoint: string,
  chainId: number,
  params?: Record<string, string>
): string {
  let url = `${API_BASE_URL}${endpoint}`.replace('{chainId}', chainId.toString());
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
  }
  
  return url;
}

/**
 * API Headers
 */
export function getApiHeaders(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  return headers;
}
