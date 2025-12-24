/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers } from 'ethers';
import { NATIVE_TOKEN_ADDRESS } from '../constants/tokens';
import { ERC20_ABI } from '../constants/contracts';

/**
 * Token approval utilities for 1inch operations
 */

/**
 * Maximum uint256 value for infinite approval
 */
export const MAX_UINT256 = ethers.MaxUint256.toString();

/**
 * Check if token requires approval
 */
export function requiresApproval(tokenAddress: string): boolean {
  return tokenAddress.toLowerCase() !== NATIVE_TOKEN_ADDRESS.toLowerCase();
}

/**
 * Check if allowance is sufficient
 */
export function isAllowanceSufficient(
  currentAllowance: string | bigint,
  requiredAmount: string | bigint
): boolean {
  const current = typeof currentAllowance === 'string' ? BigInt(currentAllowance) : currentAllowance;
  const required = typeof requiredAmount === 'string' ? BigInt(requiredAmount) : requiredAmount;
  return current >= required;
}

/**
 * Get approval amount based on strategy
 */
export type ApprovalStrategy = 'exact' | 'infinite' | 'double';

export function getApprovalAmount(
  requiredAmount: string,
  strategy: ApprovalStrategy = 'exact'
): string {
  switch (strategy) {
    case 'infinite':
      return MAX_UINT256;
    case 'double':
      return (BigInt(requiredAmount) * BigInt(2)).toString();
    case 'exact':
    default:
      return requiredAmount;
  }
}

/**
 * Build approval transaction data
 */
export function buildApprovalData(
  spender: string,
  amount: string
): string {
  const iface = new ethers.Interface(ERC20_ABI);
  return iface.encodeFunctionData('approve', [spender, amount]);
}

/**
 * Build revoke approval data (approve to 0)
 */
export function buildRevokeData(spender: string): string {
  return buildApprovalData(spender, '0');
}

/**
 * Decode approval event
 */
export interface ApprovalEvent {
  owner: string;
  spender: string;
  value: string;
}

export function decodeApprovalEvent(log: { topics: string[]; data: string }): ApprovalEvent | null {
  try {
    const iface = new ethers.Interface(ERC20_ABI);
    const parsed = iface.parseLog({ topics: log.topics, data: log.data });
    
    if (parsed && parsed.name === 'Approval') {
      return {
        owner: parsed.args[0] as string,
        spender: parsed.args[1] as string,
        value: (parsed.args[2] as bigint).toString(),
      };
    }
  } catch {
    // Invalid log data
  }
  
  return null;
}

/**
 * Calculate gas for approval transaction
 */
export function estimateApprovalGas(): number {
  // Standard ERC20 approval typically costs ~45,000 gas
  return 50000;
}

/**
 * Check if approval is infinite
 */
export function isInfiniteApproval(amount: string | bigint): boolean {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  // Consider anything above 10^50 as infinite
  return amountBigInt > BigInt('100000000000000000000000000000000000000000000000000');
}

/**
 * Format allowance for display
 */
export function formatAllowance(
  amount: string | bigint,
  decimals: number,
  symbol: string
): string {
  if (isInfiniteApproval(amount)) {
    return `Unlimited ${symbol}`;
  }
  
  const formatted = ethers.formatUnits(amount, decimals);
  const num = parseFloat(formatted);
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B ${symbol}`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M ${symbol}`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K ${symbol}`;
  }
  
  return `${num.toFixed(4)} ${symbol}`;
}

/**
 * Validate approval parameters
 */
export interface ApprovalValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateApprovalParams(params: {
  tokenAddress: string;
  spender: string;
  amount: string;
}): ApprovalValidationResult {
  const errors: string[] = [];
  
  if (!ethers.isAddress(params.tokenAddress)) {
    errors.push('Invalid token address');
  }
  
  if (params.tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
    errors.push('Native tokens do not require approval');
  }
  
  if (!ethers.isAddress(params.spender)) {
    errors.push('Invalid spender address');
  }
  
  try {
    const amount = BigInt(params.amount);
    if (amount < BigInt(0)) {
      errors.push('Amount cannot be negative');
    }
  } catch {
    errors.push('Invalid amount format');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check allowance using provider
 */
export async function checkAllowance(
  provider: ethers.Provider,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<string> {
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const allowance = await contract.allowance(ownerAddress, spenderAddress);
  return allowance.toString();
}
