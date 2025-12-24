/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers } from 'ethers';
import { NATIVE_TOKEN_ADDRESS } from '../constants/tokens';

/**
 * Swap-related utility functions for 1inch operations
 */

/**
 * Convert amount to wei based on token decimals
 */
export function toWei(amount: string | number, decimals: number = 18): string {
  return ethers.parseUnits(amount.toString(), decimals).toString();
}

/**
 * Convert wei to human-readable format
 */
export function fromWei(amount: string | bigint, decimals: number = 18): string {
  return ethers.formatUnits(amount, decimals);
}

/**
 * Check if address is native token
 */
export function isNativeToken(address: string): boolean {
  return address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();
}

/**
 * Calculate minimum return amount with slippage
 */
export function calculateMinReturn(
  amount: string | bigint,
  slippagePercent: number
): string {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  const slippageMultiplier = BigInt(Math.floor((100 - slippagePercent) * 100));
  return ((amountBigInt * slippageMultiplier) / BigInt(10000)).toString();
}

/**
 * Calculate price impact
 */
export function calculatePriceImpact(
  inputAmount: string,
  outputAmount: string,
  inputDecimals: number,
  outputDecimals: number,
  marketRate: number
): number {
  const inputValue = parseFloat(fromWei(inputAmount, inputDecimals));
  const outputValue = parseFloat(fromWei(outputAmount, outputDecimals));
  const expectedOutput = inputValue * marketRate;
  const priceImpact = ((expectedOutput - outputValue) / expectedOutput) * 100;
  return Math.max(0, priceImpact);
}

/**
 * Validate swap parameters
 */
export interface SwapValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSwapParams(params: {
  srcToken: string;
  dstToken: string;
  amount: string;
  slippage: number;
  fromAddress?: string;
}): SwapValidationResult {
  const errors: string[] = [];
  
  if (!ethers.isAddress(params.srcToken) && !isNativeToken(params.srcToken)) {
    errors.push('Invalid source token address');
  }
  
  if (!ethers.isAddress(params.dstToken) && !isNativeToken(params.dstToken)) {
    errors.push('Invalid destination token address');
  }
  
  if (params.srcToken.toLowerCase() === params.dstToken.toLowerCase()) {
    errors.push('Source and destination tokens must be different');
  }
  
  try {
    const amount = BigInt(params.amount);
    if (amount <= BigInt(0)) {
      errors.push('Amount must be greater than 0');
    }
  } catch {
    errors.push('Invalid amount format');
  }
  
  if (params.slippage < 0 || params.slippage > 50) {
    errors.push('Slippage must be between 0 and 50 percent');
  }
  
  if (params.fromAddress && !ethers.isAddress(params.fromAddress)) {
    errors.push('Invalid from address');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Build swap flags
 */
export function buildSwapFlags(options: {
  disableEstimate?: boolean;
  enablePartialFill?: boolean;
  enableMultiPath?: boolean;
}): number {
  let flags = 0;
  
  if (options.disableEstimate) {
    flags |= 1 << 0; // DISABLE_ESTIMATE
  }
  if (options.enablePartialFill) {
    flags |= 1 << 1; // ENABLE_PARTIAL_FILL
  }
  if (options.enableMultiPath) {
    flags |= 1 << 2; // ENABLE_MULTI_PATH
  }
  
  return flags;
}

/**
 * Parse swap protocols from route
 */
export interface SwapProtocol {
  name: string;
  part: number;
  fromTokenAddress: string;
  toTokenAddress: string;
}

export function parseSwapProtocols(protocols: unknown[][]): SwapProtocol[] {
  const result: SwapProtocol[] = [];
  
  for (const route of protocols) {
    for (const step of route) {
      if (Array.isArray(step)) {
        for (const protocol of step) {
          if (typeof protocol === 'object' && protocol !== null) {
            const p = protocol as Record<string, unknown>;
            result.push({
              name: String(p.name || 'Unknown'),
              part: Number(p.part || 0),
              fromTokenAddress: String(p.fromTokenAddress || ''),
              toTokenAddress: String(p.toTokenAddress || ''),
            });
          }
        }
      }
    }
  }
  
  return result;
}

/**
 * Format gas estimate
 */
export function formatGasEstimate(gas: string | number): {
  gas: string;
  gasFormatted: string;
} {
  const gasValue = typeof gas === 'string' ? parseInt(gas, 10) : gas;
  return {
    gas: gasValue.toString(),
    gasFormatted: gasValue.toLocaleString(),
  };
}

/**
 * Calculate effective exchange rate
 */
export function calculateExchangeRate(
  inputAmount: string,
  outputAmount: string,
  inputDecimals: number,
  outputDecimals: number
): number {
  const input = parseFloat(fromWei(inputAmount, inputDecimals));
  const output = parseFloat(fromWei(outputAmount, outputDecimals));
  return input > 0 ? output / input : 0;
}
