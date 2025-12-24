/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * 1inch Protocol contract addresses by chain ID
 */
export const AGGREGATION_ROUTER_V6 = '0x111111125421cA6dc452d289314280a0f8842A65';

export const FUSION_SETTLEMENT = '0xa88800CD213dA5Ae406ce248380802BD16b31c0b';

export const LIMIT_ORDER_PROTOCOL = '0x111111125421cA6dc452d289314280a0f8842A65';

/**
 * Contract addresses indexed by chain ID
 */
export const CONTRACT_ADDRESSES: Record<number, {
  aggregationRouter: string;
  limitOrderProtocol: string;
  fusionSettlement: string;
  oneInchToken?: string;
  staking?: string;
  governance?: string;
}> = {
  // Ethereum Mainnet
  1: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    oneInchToken: '0x111111111117dC0aa78b770fA6A738034120C302',
    staking: '0x9A0C8Ff858d273f57072D714bca7411D717501D7',
    governance: '0x7f3C5cC04E3d63ea3A7A1E95C2D0F37A0E4B1c8e',
  },
  // Polygon
  137: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
  },
  // BNB Chain
  56: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    oneInchToken: '0x111111111117dC0aa78b770fA6A738034120C302',
  },
  // Arbitrum
  42161: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
  },
  // Optimism
  10: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
  },
  // Avalanche
  43114: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
  },
  // Gnosis
  100: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
  },
  // Fantom
  250: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
  },
  // Base
  8453: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
  },
  // zkSync Era
  324: {
    aggregationRouter: '0x6fd4383cB451173D5f9304F041C7BCBf27d561fF',
    limitOrderProtocol: '0x6fd4383cB451173D5f9304F041C7BCBf27d561fF',
    fusionSettlement: '0x0000000000000000000000000000000000000000',
  },
  // Aurora
  1313161554: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0x0000000000000000000000000000000000000000',
  },
  // Klaytn
  8217: {
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0x0000000000000000000000000000000000000000',
  },
};

/**
 * ERC20 Token ABI for common operations
 */
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

/**
 * Aggregation Router V6 ABI (partial)
 */
export const AGGREGATION_ROUTER_ABI = [
  'function swap(address executor, tuple(address srcToken, address dstToken, address srcReceiver, address dstReceiver, uint256 amount, uint256 minReturnAmount, uint256 flags) desc, bytes permit, bytes data) payable returns (uint256 returnAmount, uint256 spentAmount)',
  'function unoswap(address srcToken, uint256 amount, uint256 minReturn, uint256 pools) returns (uint256 returnAmount)',
  'function unoswapTo(address recipient, address srcToken, uint256 amount, uint256 minReturn, uint256 pools) returns (uint256 returnAmount)',
  'function uniswapV3Swap(uint256 amount, uint256 minReturn, uint256[] pools) returns (uint256 returnAmount)',
  'function uniswapV3SwapTo(address recipient, uint256 amount, uint256 minReturn, uint256[] pools) returns (uint256 returnAmount)',
];

/**
 * Get contract addresses for a specific chain
 */
export function getContractAddresses(chainId: number) {
  return CONTRACT_ADDRESSES[chainId] || null;
}
