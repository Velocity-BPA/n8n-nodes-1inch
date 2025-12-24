/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * 1inch Network supported chains and their configurations
 */
export interface NetworkConfig {
  chainId: number;
  name: string;
  shortName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  aggregationRouter: string;
  limitOrderProtocol: string;
  fusionSettlement: string;
  isTestnet: boolean;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    shortName: 'eth',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://eth.llamarpc.com',
      'https://rpc.ankr.com/eth',
      'https://ethereum.publicnode.com',
    ],
    blockExplorerUrls: ['https://etherscan.io'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    isTestnet: false,
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    shortName: 'matic',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: [
      'https://polygon.llamarpc.com',
      'https://rpc.ankr.com/polygon',
      'https://polygon-bor.publicnode.com',
    ],
    blockExplorerUrls: ['https://polygonscan.com'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    isTestnet: false,
  },
  bsc: {
    chainId: 56,
    name: 'BNB Chain',
    shortName: 'bsc',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: [
      'https://bsc.llamarpc.com',
      'https://rpc.ankr.com/bsc',
      'https://bsc.publicnode.com',
    ],
    blockExplorerUrls: ['https://bscscan.com'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    isTestnet: false,
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    shortName: 'arb1',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://arbitrum.llamarpc.com',
      'https://rpc.ankr.com/arbitrum',
      'https://arbitrum-one.publicnode.com',
    ],
    blockExplorerUrls: ['https://arbiscan.io'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    isTestnet: false,
  },
  optimism: {
    chainId: 10,
    name: 'Optimism',
    shortName: 'oeth',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://optimism.llamarpc.com',
      'https://rpc.ankr.com/optimism',
      'https://optimism.publicnode.com',
    ],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    isTestnet: false,
  },
  avalanche: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    shortName: 'avax',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: [
      'https://avalanche.drpc.org',
      'https://rpc.ankr.com/avalanche',
      'https://avalanche-c-chain.publicnode.com',
    ],
    blockExplorerUrls: ['https://snowtrace.io'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    isTestnet: false,
  },
  gnosis: {
    chainId: 100,
    name: 'Gnosis Chain',
    shortName: 'gno',
    nativeCurrency: {
      name: 'xDai',
      symbol: 'xDAI',
      decimals: 18,
    },
    rpcUrls: [
      'https://rpc.gnosischain.com',
      'https://rpc.ankr.com/gnosis',
      'https://gnosis.publicnode.com',
    ],
    blockExplorerUrls: ['https://gnosisscan.io'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    isTestnet: false,
  },
  fantom: {
    chainId: 250,
    name: 'Fantom Opera',
    shortName: 'ftm',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: [
      'https://rpc.ftm.tools',
      'https://rpc.ankr.com/fantom',
      'https://fantom.publicnode.com',
    ],
    blockExplorerUrls: ['https://ftmscan.com'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    isTestnet: false,
  },
  base: {
    chainId: 8453,
    name: 'Base',
    shortName: 'base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://base.llamarpc.com',
      'https://rpc.ankr.com/base',
      'https://base.publicnode.com',
    ],
    blockExplorerUrls: ['https://basescan.org'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0xa88800CD213dA5Ae406ce248380802BD16b31c0b',
    isTestnet: false,
  },
  zksync: {
    chainId: 324,
    name: 'zkSync Era',
    shortName: 'zksync',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://mainnet.era.zksync.io',
      'https://zksync.drpc.org',
    ],
    blockExplorerUrls: ['https://explorer.zksync.io'],
    aggregationRouter: '0x6fd4383cB451173D5f9304F041C7BCBf27d561fF',
    limitOrderProtocol: '0x6fd4383cB451173D5f9304F041C7BCBf27d561fF',
    fusionSettlement: '0x0000000000000000000000000000000000000000',
    isTestnet: false,
  },
  aurora: {
    chainId: 1313161554,
    name: 'Aurora',
    shortName: 'aurora',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://mainnet.aurora.dev',
      'https://aurora.drpc.org',
    ],
    blockExplorerUrls: ['https://aurorascan.dev'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0x0000000000000000000000000000000000000000',
    isTestnet: false,
  },
  klaytn: {
    chainId: 8217,
    name: 'Klaytn',
    shortName: 'klaytn',
    nativeCurrency: {
      name: 'KLAY',
      symbol: 'KLAY',
      decimals: 18,
    },
    rpcUrls: [
      'https://public-en-cypress.klaytn.net',
      'https://klaytn.drpc.org',
    ],
    blockExplorerUrls: ['https://scope.klaytn.com'],
    aggregationRouter: '0x111111125421cA6dc452d289314280a0f8842A65',
    limitOrderProtocol: '0x111111125421cA6dc452d289314280a0f8842A65',
    fusionSettlement: '0x0000000000000000000000000000000000000000',
    isTestnet: false,
  },
};

export const CHAIN_ID_TO_NETWORK: Record<number, string> = Object.entries(NETWORKS).reduce(
  (acc, [key, value]) => {
    acc[value.chainId] = key;
    return acc;
  },
  {} as Record<number, string>,
);

export const NETWORK_OPTIONS = Object.entries(NETWORKS).map(([key, config]) => ({
  name: config.name,
  value: key,
}));

export function getNetworkConfig(networkOrChainId: string | number): NetworkConfig | undefined {
  if (typeof networkOrChainId === 'number') {
    const networkName = CHAIN_ID_TO_NETWORK[networkOrChainId];
    return networkName ? NETWORKS[networkName] : undefined;
  }
  return NETWORKS[networkOrChainId];
}

export function getChainId(network: string): number | undefined {
  return NETWORKS[network]?.chainId;
}
