/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers } from 'ethers';

/**
 * Routing and pathfinding utilities for 1inch operations
 */

/**
 * Route information interface
 */
export interface RouteInfo {
  protocol: string;
  part: number;
  fromToken: string;
  toToken: string;
}

/**
 * Path step interface
 */
export interface PathStep {
  protocols: RouteInfo[];
  intermediateToken?: string;
}

/**
 * Parse route information from 1inch response
 */
export function parseRoutes(protocols: unknown[][][]): PathStep[] {
  const paths: PathStep[] = [];
  
  for (const path of protocols) {
    const steps: RouteInfo[] = [];
    
    for (const step of path) {
      for (const protocol of step) {
        if (typeof protocol === 'object' && protocol !== null) {
          const p = protocol as Record<string, unknown>;
          steps.push({
            protocol: String(p.name || 'Unknown'),
            part: Number(p.part || 0),
            fromToken: String(p.fromTokenAddress || ''),
            toToken: String(p.toTokenAddress || ''),
          });
        }
      }
    }
    
    if (steps.length > 0) {
      paths.push({ protocols: steps });
    }
  }
  
  return paths;
}

/**
 * Get unique protocols from routes
 */
export function getUniqueProtocols(paths: PathStep[]): string[] {
  const protocols = new Set<string>();
  
  for (const path of paths) {
    for (const step of path.protocols) {
      protocols.add(step.protocol);
    }
  }
  
  return Array.from(protocols);
}

/**
 * Get intermediate tokens from routes
 */
export function getIntermediateTokens(
  paths: PathStep[],
  srcToken: string,
  dstToken: string
): string[] {
  const intermediateTokens = new Set<string>();
  const srcLower = srcToken.toLowerCase();
  const dstLower = dstToken.toLowerCase();
  
  for (const path of paths) {
    for (const step of path.protocols) {
      const fromLower = step.fromToken.toLowerCase();
      const toLower = step.toToken.toLowerCase();
      
      if (fromLower !== srcLower && fromLower !== dstLower) {
        intermediateTokens.add(step.fromToken);
      }
      if (toLower !== srcLower && toLower !== dstLower) {
        intermediateTokens.add(step.toToken);
      }
    }
  }
  
  return Array.from(intermediateTokens);
}

/**
 * Calculate route distribution
 */
export interface RouteDistribution {
  protocol: string;
  percentage: number;
}

export function calculateRouteDistribution(paths: PathStep[]): RouteDistribution[] {
  const distribution: Record<string, number> = {};
  
  for (const path of paths) {
    for (const step of path.protocols) {
      const key = step.protocol;
      distribution[key] = (distribution[key] || 0) + step.part;
    }
  }
  
  return Object.entries(distribution)
    .map(([protocol, percentage]) => ({ protocol, percentage }))
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Estimate gas for route complexity
 */
export function estimateRouteGas(paths: PathStep[]): number {
  const BASE_GAS = 21000;
  const GAS_PER_HOP = 100000;
  const GAS_PER_PROTOCOL = 50000;
  
  let totalHops = 0;
  const uniqueProtocols = new Set<string>();
  
  for (const path of paths) {
    totalHops += path.protocols.length;
    for (const step of path.protocols) {
      uniqueProtocols.add(step.protocol);
    }
  }
  
  return BASE_GAS + (totalHops * GAS_PER_HOP) + (uniqueProtocols.size * GAS_PER_PROTOCOL);
}

/**
 * Check if route is direct (single hop)
 */
export function isDirectRoute(paths: PathStep[]): boolean {
  if (paths.length !== 1) return false;
  return paths[0].protocols.length === 1;
}

/**
 * Check if route involves a specific protocol
 */
export function routeIncludesProtocol(paths: PathStep[], protocol: string): boolean {
  const protocolLower = protocol.toLowerCase();
  
  for (const path of paths) {
    for (const step of path.protocols) {
      if (step.protocol.toLowerCase().includes(protocolLower)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Format route for display
 */
export function formatRoute(paths: PathStep[]): string {
  const parts: string[] = [];
  
  for (const path of paths) {
    const protocolNames = path.protocols.map(
      (p) => `${p.protocol} (${p.part}%)`
    );
    parts.push(protocolNames.join(' -> '));
  }
  
  return parts.join(' | ');
}

/**
 * Validate token path
 */
export function validateTokenPath(
  fromToken: string,
  toToken: string,
  paths: PathStep[]
): boolean {
  if (paths.length === 0) return false;
  
  const fromLower = fromToken.toLowerCase();
  const toLower = toToken.toLowerCase();
  
  // Check if first step starts with source token
  for (const path of paths) {
    if (path.protocols.length > 0) {
      const firstStep = path.protocols[0];
      if (firstStep.fromToken.toLowerCase() !== fromLower) {
        return false;
      }
    }
    
    // Check if last step ends with destination token
    const lastStep = path.protocols[path.protocols.length - 1];
    if (lastStep && lastStep.toToken.toLowerCase() !== toLower) {
      // Could be intermediate path, verify continuity
      const allTokens = path.protocols.map((p) => [p.fromToken, p.toToken]).flat();
      if (!allTokens.some((t) => t.toLowerCase() === toLower)) {
        return false;
      }
    }
  }
  
  return true;
}
