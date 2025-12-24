/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';

import * as swap from './actions/swap';
import * as fusion from './actions/fusion';

// Emit licensing notice on node load (once per process)
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licensingNoticeEmitted = false;
function emitLicensingNotice() {
  if (!licensingNoticeEmitted) {
    console.warn(LICENSING_NOTICE);
    licensingNoticeEmitted = true;
  }
}

export class OneInch implements INodeType {
  description: INodeTypeDescription = {
    displayName: '1inch',
    name: 'oneInch',
    icon: 'file:oneInch.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with 1inch Network DEX aggregator, Fusion, and limit orders',
    defaults: {
      name: '1inch',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'oneInchNetwork',
        required: false,
      },
      {
        name: 'oneInchApi',
        required: false,
      },
      {
        name: 'oneInchFusion',
        required: false,
        displayOptions: {
          show: {
            resource: ['fusion'],
          },
        },
      },
    ],
    properties: [
      {
        displayName: 'Network',
        name: 'network',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Ethereum Mainnet', value: 'ethereum' },
          { name: 'Polygon', value: 'polygon' },
          { name: 'BNB Chain', value: 'bsc' },
          { name: 'Arbitrum One', value: 'arbitrum' },
          { name: 'Optimism', value: 'optimism' },
          { name: 'Avalanche C-Chain', value: 'avalanche' },
          { name: 'Gnosis Chain', value: 'gnosis' },
          { name: 'Fantom Opera', value: 'fantom' },
          { name: 'Base', value: 'base' },
          { name: 'zkSync Era', value: 'zksync' },
          { name: 'Aurora', value: 'aurora' },
          { name: 'Klaytn', value: 'klaytn' },
        ],
        default: 'ethereum',
        description: 'The blockchain network to use',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Swap', value: 'swap' },
          { name: 'Fusion (Gasless)', value: 'fusion' },
          { name: 'Aggregation', value: 'aggregation' },
          { name: 'Limit Order', value: 'limitOrder' },
          { name: 'Token', value: 'token' },
          { name: 'Price', value: 'price' },
          { name: 'Liquidity Sources', value: 'liquiditySources' },
          { name: 'Portfolio', value: 'portfolio' },
          { name: 'Balance', value: 'balance' },
          { name: 'Approve', value: 'approve' },
          { name: 'Health Check', value: 'healthCheck' },
          { name: 'Gas', value: 'gas' },
          { name: 'Pathfinder', value: 'pathfinder' },
          { name: 'Cross-Chain (Fusion+)', value: 'crossChain' },
          { name: 'Resolver', value: 'resolver' },
          { name: 'Referral', value: 'referral' },
          { name: 'Staking', value: 'staking' },
          { name: 'Governance', value: 'governance' },
          { name: 'NFT', value: 'nft' },
          { name: 'Spot Price', value: 'spotPrice' },
          { name: 'Utility', value: 'utility' },
        ],
        default: 'swap',
        description: 'The resource to operate on',
      },
      // Swap Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['swap'],
          },
        },
        options: [
          { name: 'Get Quote', value: 'getQuote', action: 'Get swap quote' },
          { name: 'Get Swap Calldata', value: 'getSwapCalldata', action: 'Get swap transaction data' },
          { name: 'Get Supported Tokens', value: 'getSupportedTokens', action: 'Get supported tokens' },
          { name: 'Get Liquidity Sources', value: 'getLiquiditySources', action: 'Get liquidity sources' },
          { name: 'Check Allowance', value: 'checkAllowance', action: 'Check token allowance' },
          { name: 'Get Approval Calldata', value: 'getApprovalCalldata', action: 'Get approval transaction' },
          { name: 'Get Spender Address', value: 'getSpender', action: 'Get router spender address' },
        ],
        default: 'getQuote',
      },
      // Fusion Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['fusion'],
          },
        },
        options: [
          { name: 'Get Quote', value: 'getQuote', action: 'Get Fusion quote' },
          { name: 'Get All Quotes', value: 'getAllQuotes', action: 'Get all Fusion quotes' },
          { name: 'Get Order Status', value: 'getOrderStatus', action: 'Get Fusion order status' },
          { name: 'Get Active Orders', value: 'getActiveOrders', action: 'Get active Fusion orders' },
          { name: 'Get Orders by Maker', value: 'getOrdersByMaker', action: 'Get orders by maker' },
          { name: 'Get Resolvers', value: 'getResolvers', action: 'Get Fusion resolvers' },
        ],
        default: 'getQuote',
      },
      // Token Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['token'],
          },
        },
        options: [
          { name: 'Get Token Info', value: 'getTokenInfo', action: 'Get token information' },
          { name: 'Search Tokens', value: 'searchTokens', action: 'Search for tokens' },
          { name: 'Get Token List', value: 'getTokenList', action: 'Get all supported tokens' },
        ],
        default: 'getTokenInfo',
      },
      // Price Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['price'],
          },
        },
        options: [
          { name: 'Get Spot Price', value: 'getSpotPrice', action: 'Get token spot price' },
          { name: 'Get Multiple Prices', value: 'getMultiplePrices', action: 'Get multiple token prices' },
        ],
        default: 'getSpotPrice',
      },
      // Gas Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['gas'],
          },
        },
        options: [
          { name: 'Get Gas Price', value: 'getGasPrice', action: 'Get current gas prices' },
        ],
        default: 'getGasPrice',
      },
      // Balance Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['balance'],
          },
        },
        options: [
          { name: 'Get Token Balance', value: 'getTokenBalance', action: 'Get token balance' },
          { name: 'Get All Balances', value: 'getAllBalances', action: 'Get all token balances' },
        ],
        default: 'getTokenBalance',
      },
      // Include swap action properties
      ...swap.getQuote.description,
      ...swap.getSwapCalldata.description,
      // Include fusion action properties
      ...fusion.getQuote.description,
    ],
  };

  constructor() {
    emitLicensingNotice();
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    const network = this.getNodeParameter('network', 0) as string;

    // Get API key from credentials if available
    let apiKey: string | undefined;
    try {
      const credentials = await this.getCredentials('oneInchApi');
      apiKey = credentials?.apiKey as string;
    } catch {
      // No credentials provided, will use without API key
    }

    let returnData: INodeExecutionData[] = [];

    switch (resource) {
      case 'swap':
        switch (operation) {
          case 'getQuote':
            returnData = await swap.getQuote.execute.call(this, items, network, apiKey);
            break;
          case 'getSwapCalldata':
            returnData = await swap.getSwapCalldata.execute.call(this, items, network, apiKey);
            break;
          default:
            throw new Error(`Operation "${operation}" is not supported for resource "${resource}"`);
        }
        break;
      case 'fusion':
        switch (operation) {
          case 'getQuote':
            returnData = await fusion.getQuote.execute.call(this, items, network, apiKey);
            break;
          default:
            throw new Error(`Operation "${operation}" is not supported for resource "${resource}"`);
        }
        break;
      default:
        throw new Error(`Resource "${resource}" is not supported`);
    }

    return [returnData];
  }
}
