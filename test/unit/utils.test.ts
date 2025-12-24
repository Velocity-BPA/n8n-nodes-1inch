/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  toWei,
  fromWei,
  isNativeToken,
  calculateMinReturn,
  validateSwapParams,
  calculateExchangeRate,
} from '../nodes/OneInch/utils/swapUtils';
import { getChainId, getNetworkConfig, NETWORKS } from '../nodes/OneInch/constants/networks';
import { NATIVE_TOKEN_ADDRESS } from '../nodes/OneInch/constants/tokens';

describe('Swap Utils', () => {
  describe('toWei', () => {
    it('should convert whole numbers to wei', () => {
      expect(toWei('1', 18)).toBe('1000000000000000000');
      expect(toWei(1, 18)).toBe('1000000000000000000');
    });

    it('should handle different decimals', () => {
      expect(toWei('1', 6)).toBe('1000000');
      expect(toWei('1.5', 6)).toBe('1500000');
    });

    it('should handle decimal amounts', () => {
      expect(toWei('0.5', 18)).toBe('500000000000000000');
    });
  });

  describe('fromWei', () => {
    it('should convert wei to human readable', () => {
      expect(fromWei('1000000000000000000', 18)).toBe('1.0');
    });

    it('should handle different decimals', () => {
      expect(fromWei('1000000', 6)).toBe('1.0');
    });

    it('should handle bigint input', () => {
      expect(fromWei(BigInt('1000000000000000000'), 18)).toBe('1.0');
    });
  });

  describe('isNativeToken', () => {
    it('should return true for native token address', () => {
      expect(isNativeToken(NATIVE_TOKEN_ADDRESS)).toBe(true);
      expect(isNativeToken(NATIVE_TOKEN_ADDRESS.toLowerCase())).toBe(true);
    });

    it('should return false for ERC20 tokens', () => {
      expect(isNativeToken('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')).toBe(false);
    });
  });

  describe('calculateMinReturn', () => {
    it('should calculate minimum return with slippage', () => {
      const result = calculateMinReturn('1000000000000000000', 1);
      expect(result).toBe('990000000000000000');
    });

    it('should handle 0% slippage', () => {
      const result = calculateMinReturn('1000000000000000000', 0);
      expect(result).toBe('1000000000000000000');
    });

    it('should handle higher slippage', () => {
      const result = calculateMinReturn('1000000000000000000', 5);
      expect(result).toBe('950000000000000000');
    });
  });

  describe('validateSwapParams', () => {
    it('should validate correct parameters', () => {
      const result = validateSwapParams({
        srcToken: NATIVE_TOKEN_ADDRESS,
        dstToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        amount: '1000000000000000000',
        slippage: 1,
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject same source and destination', () => {
      const result = validateSwapParams({
        srcToken: NATIVE_TOKEN_ADDRESS,
        dstToken: NATIVE_TOKEN_ADDRESS,
        amount: '1000000000000000000',
        slippage: 1,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Source and destination tokens must be different');
    });

    it('should reject invalid slippage', () => {
      const result = validateSwapParams({
        srcToken: NATIVE_TOKEN_ADDRESS,
        dstToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        amount: '1000000000000000000',
        slippage: 60,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Slippage must be between 0 and 50 percent');
    });

    it('should reject zero amount', () => {
      const result = validateSwapParams({
        srcToken: NATIVE_TOKEN_ADDRESS,
        dstToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        amount: '0',
        slippage: 1,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Amount must be greater than 0');
    });
  });

  describe('calculateExchangeRate', () => {
    it('should calculate exchange rate between tokens', () => {
      const rate = calculateExchangeRate(
        '1000000000000000000', // 1 ETH
        '2000000000', // 2000 USDC
        18,
        6
      );
      expect(rate).toBe(2000);
    });

    it('should handle zero input', () => {
      const rate = calculateExchangeRate('0', '2000000000', 18, 6);
      expect(rate).toBe(0);
    });
  });
});

describe('Network Constants', () => {
  describe('getChainId', () => {
    it('should return correct chain ID for known networks', () => {
      expect(getChainId('ethereum')).toBe(1);
      expect(getChainId('polygon')).toBe(137);
      expect(getChainId('arbitrum')).toBe(42161);
    });

    it('should return undefined for unknown networks', () => {
      expect(getChainId('unknown')).toBeUndefined();
    });
  });

  describe('getNetworkConfig', () => {
    it('should return network config by name', () => {
      const config = getNetworkConfig('ethereum');
      expect(config).toBeDefined();
      expect(config?.chainId).toBe(1);
      expect(config?.name).toBe('Ethereum Mainnet');
    });

    it('should return network config by chain ID', () => {
      const config = getNetworkConfig(137);
      expect(config).toBeDefined();
      expect(config?.name).toBe('Polygon');
    });
  });

  describe('NETWORKS', () => {
    it('should have all required fields for each network', () => {
      for (const [, config] of Object.entries(NETWORKS)) {
        expect(config.chainId).toBeDefined();
        expect(config.name).toBeDefined();
        expect(config.nativeCurrency).toBeDefined();
        expect(config.rpcUrls.length).toBeGreaterThan(0);
        expect(config.aggregationRouter).toBeDefined();
      }
    });
  });
});
