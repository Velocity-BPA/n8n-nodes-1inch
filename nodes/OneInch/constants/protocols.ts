/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * 1inch Liquidity Sources and Protocols
 */
export interface LiquiditySource {
  id: string;
  name: string;
  img?: string;
}

/**
 * Major liquidity sources supported by 1inch
 */
export const LIQUIDITY_SOURCES: Record<number, LiquiditySource[]> = {
  // Ethereum Mainnet
  1: [
    { id: 'UNISWAP_V2', name: 'Uniswap V2' },
    { id: 'UNISWAP_V3', name: 'Uniswap V3' },
    { id: 'SUSHISWAP', name: 'SushiSwap' },
    { id: 'CURVE', name: 'Curve' },
    { id: 'CURVE_V2', name: 'Curve V2' },
    { id: 'BALANCER', name: 'Balancer' },
    { id: 'BALANCER_V2', name: 'Balancer V2' },
    { id: '0X', name: '0x' },
    { id: 'KYBER', name: 'Kyber' },
    { id: 'KYBER_DMM', name: 'Kyber DMM' },
    { id: 'BANCOR', name: 'Bancor' },
    { id: 'BANCOR_V3', name: 'Bancor V3' },
    { id: 'DODO', name: 'DODO' },
    { id: 'DODO_V2', name: 'DODO V2' },
    { id: 'MOONISWAP', name: 'Mooniswap' },
    { id: 'SHIBASWAP', name: 'ShibaSwap' },
    { id: 'CLIPPER', name: 'Clipper' },
    { id: 'LIDO', name: 'Lido' },
    { id: 'MAKER_PSM', name: 'Maker PSM' },
    { id: 'AAVE_V2', name: 'Aave V2' },
    { id: 'AAVE_V3', name: 'Aave V3' },
    { id: 'COMPOUND', name: 'Compound' },
    { id: 'SYNTHETIX', name: 'Synthetix' },
    { id: 'ROCKET_POOL', name: 'Rocket Pool' },
    { id: 'FRAX', name: 'Frax' },
    { id: 'MAVERICK', name: 'Maverick' },
    { id: 'PANCAKESWAP_V3', name: 'PancakeSwap V3' },
  ],
  // Polygon
  137: [
    { id: 'QUICKSWAP', name: 'QuickSwap' },
    { id: 'QUICKSWAP_V3', name: 'QuickSwap V3' },
    { id: 'SUSHISWAP', name: 'SushiSwap' },
    { id: 'UNISWAP_V3', name: 'Uniswap V3' },
    { id: 'CURVE', name: 'Curve' },
    { id: 'BALANCER_V2', name: 'Balancer V2' },
    { id: 'DODO', name: 'DODO' },
    { id: 'DODO_V2', name: 'DODO V2' },
    { id: 'DFYN', name: 'Dfyn' },
    { id: 'WAULTSWAP', name: 'WaultSwap' },
    { id: 'APESWAP', name: 'ApeSwap' },
    { id: 'AAVE_V2', name: 'Aave V2' },
    { id: 'AAVE_V3', name: 'Aave V3' },
    { id: 'MESHSWAP', name: 'MeshSwap' },
  ],
  // BNB Chain
  56: [
    { id: 'PANCAKESWAP', name: 'PancakeSwap' },
    { id: 'PANCAKESWAP_V3', name: 'PancakeSwap V3' },
    { id: 'SUSHISWAP', name: 'SushiSwap' },
    { id: 'BISWAP', name: 'BiSwap' },
    { id: 'DODO', name: 'DODO' },
    { id: 'DODO_V2', name: 'DODO V2' },
    { id: 'BAKERYSWAP', name: 'BakerySwap' },
    { id: 'APESWAP', name: 'ApeSwap' },
    { id: 'WAULTSWAP', name: 'WaultSwap' },
    { id: 'VENUS', name: 'Venus' },
    { id: 'ELLIPSIS', name: 'Ellipsis' },
    { id: 'NERVE', name: 'Nerve' },
    { id: 'THENA', name: 'THENA' },
    { id: 'UNISWAP_V3', name: 'Uniswap V3' },
  ],
  // Arbitrum
  42161: [
    { id: 'UNISWAP_V3', name: 'Uniswap V3' },
    { id: 'SUSHISWAP', name: 'SushiSwap' },
    { id: 'CURVE', name: 'Curve' },
    { id: 'BALANCER_V2', name: 'Balancer V2' },
    { id: 'CAMELOT', name: 'Camelot' },
    { id: 'CAMELOT_V3', name: 'Camelot V3' },
    { id: 'GMX', name: 'GMX' },
    { id: 'ZYBERSWAP', name: 'ZyberSwap' },
    { id: 'TRADERJOE_V2', name: 'Trader Joe V2' },
    { id: 'DODO', name: 'DODO' },
    { id: 'DODO_V2', name: 'DODO V2' },
    { id: 'AAVE_V3', name: 'Aave V3' },
    { id: 'RAMSES', name: 'Ramses' },
  ],
  // Optimism
  10: [
    { id: 'UNISWAP_V3', name: 'Uniswap V3' },
    { id: 'VELODROME', name: 'Velodrome' },
    { id: 'VELODROME_V2', name: 'Velodrome V2' },
    { id: 'CURVE', name: 'Curve' },
    { id: 'BEETHOVENX', name: 'Beethoven X' },
    { id: 'SYNTHETIX', name: 'Synthetix' },
    { id: 'ZIPSWAP', name: 'ZipSwap' },
    { id: 'SUSHISWAP', name: 'SushiSwap' },
    { id: 'AAVE_V3', name: 'Aave V3' },
    { id: 'KYBERSWAP', name: 'KyberSwap' },
  ],
  // Avalanche
  43114: [
    { id: 'TRADERJOE', name: 'Trader Joe' },
    { id: 'TRADERJOE_V2', name: 'Trader Joe V2' },
    { id: 'PANGOLIN', name: 'Pangolin' },
    { id: 'SUSHISWAP', name: 'SushiSwap' },
    { id: 'CURVE', name: 'Curve' },
    { id: 'PLATYPUS', name: 'Platypus' },
    { id: 'KYBERSWAP', name: 'KyberSwap' },
    { id: 'GMX', name: 'GMX' },
    { id: 'UNISWAP_V3', name: 'Uniswap V3' },
    { id: 'AAVE_V3', name: 'Aave V3' },
  ],
  // Base
  8453: [
    { id: 'UNISWAP_V3', name: 'Uniswap V3' },
    { id: 'AERODROME', name: 'Aerodrome' },
    { id: 'BASESWAP', name: 'BaseSwap' },
    { id: 'SUSHISWAP', name: 'SushiSwap' },
    { id: 'BALANCER_V2', name: 'Balancer V2' },
    { id: 'MAVERICK', name: 'Maverick' },
    { id: 'CURVE', name: 'Curve' },
    { id: 'PANCAKESWAP_V3', name: 'PancakeSwap V3' },
  ],
};

/**
 * Protocol identifiers for routing
 */
export const PROTOCOL_IDS = {
  UNISWAP_V2: 'UNISWAP_V2',
  UNISWAP_V3: 'UNISWAP_V3',
  SUSHISWAP: 'SUSHISWAP',
  CURVE: 'CURVE',
  CURVE_V2: 'CURVE_V2',
  BALANCER: 'BALANCER',
  BALANCER_V2: 'BALANCER_V2',
  BANCOR: 'BANCOR',
  BANCOR_V3: 'BANCOR_V3',
  KYBER: 'KYBER',
  KYBER_DMM: 'KYBER_DMM',
  DODO: 'DODO',
  DODO_V2: 'DODO_V2',
  MOONISWAP: 'MOONISWAP',
  COMPOUND: 'COMPOUND',
  AAVE: 'AAVE',
  AAVE_V2: 'AAVE_V2',
  AAVE_V3: 'AAVE_V3',
  MAKER_PSM: 'MAKER_PSM',
  LIDO: 'LIDO',
  SYNTHETIX: 'SYNTHETIX',
  PMM: 'PMM',
  PMM2: 'PMM2',
  PMM3: 'PMM3',
  PMM4: 'PMM4',
} as const;

/**
 * Get liquidity sources for a chain
 */
export function getLiquiditySources(chainId: number): LiquiditySource[] {
  return LIQUIDITY_SOURCES[chainId] || [];
}
