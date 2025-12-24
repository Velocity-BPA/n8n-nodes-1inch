/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { AggregationClient } from '../nodes/OneInch/transport/aggregationClient';
import { FusionClient } from '../nodes/OneInch/transport/fusionClient';
import { PriceClient } from '../nodes/OneInch/transport/priceClient';

// Skip integration tests if no API key
const API_KEY = process.env.ONEINCH_API_KEY;
const describeIfApiKey = API_KEY ? describe : describe.skip;

describeIfApiKey('1inch API Integration Tests', () => {
  const CHAIN_ID = 1; // Ethereum Mainnet
  const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  
  describe('AggregationClient', () => {
    let client: AggregationClient;
    
    beforeAll(() => {
      client = new AggregationClient(CHAIN_ID, API_KEY);
    });
    
    it('should get swap quote', async () => {
      const quote = await client.getQuote({
        src: WETH_ADDRESS,
        dst: USDC_ADDRESS,
        amount: '1000000000000000000', // 1 WETH
      });
      
      expect(quote).toBeDefined();
      expect(quote.dstAmount).toBeDefined();
      expect(BigInt(quote.dstAmount)).toBeGreaterThan(0n);
    }, 30000);
    
    it('should get liquidity sources', async () => {
      const sources = await client.getLiquiditySources();
      
      expect(sources).toBeDefined();
      expect(sources.protocols).toBeDefined();
      expect(sources.protocols.length).toBeGreaterThan(0);
    }, 30000);
    
    it('should get supported tokens', async () => {
      const tokens = await client.getTokens();
      
      expect(tokens).toBeDefined();
      expect(tokens.tokens).toBeDefined();
      expect(Object.keys(tokens.tokens).length).toBeGreaterThan(0);
    }, 30000);
    
    it('should get spender address', async () => {
      const spender = await client.getSpender();
      
      expect(spender).toBeDefined();
      expect(spender.address).toBeDefined();
      expect(spender.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    }, 30000);
  });
  
  describe('PriceClient', () => {
    let client: PriceClient;
    
    beforeAll(() => {
      client = new PriceClient(CHAIN_ID, API_KEY);
    });
    
    it('should get spot price for token', async () => {
      const price = await client.getSpotPrice(WETH_ADDRESS);
      
      expect(price).toBeDefined();
      expect(price[WETH_ADDRESS]).toBeDefined();
    }, 30000);
    
    it('should get spot prices for multiple tokens', async () => {
      const prices = await client.getSpotPrices([WETH_ADDRESS, USDC_ADDRESS]);
      
      expect(prices).toBeDefined();
      expect(Object.keys(prices).length).toBeGreaterThanOrEqual(1);
    }, 30000);
  });
  
  describe('FusionClient', () => {
    let client: FusionClient;
    
    beforeAll(() => {
      client = new FusionClient(CHAIN_ID, API_KEY);
    });
    
    it('should get Fusion resolvers', async () => {
      const resolvers = await client.getResolvers();
      
      expect(resolvers).toBeDefined();
      expect(resolvers.resolvers).toBeDefined();
    }, 30000);
  });
});
