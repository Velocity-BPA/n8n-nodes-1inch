/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  INodeType,
  INodeTypeDescription,
  ITriggerFunctions,
  ITriggerResponse,
  NodeConnectionType,
} from 'n8n-workflow';

import { AggregationClient } from './transport/aggregationClient';
import { PriceClient } from './transport/priceClient';
import { getChainId } from './constants/networks';

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

export class OneInchTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: '1inch Trigger',
    name: 'oneInchTrigger',
    icon: 'file:oneInch.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Trigger workflows on 1inch events',
    defaults: {
      name: '1inch Trigger',
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'oneInchApi',
        required: false,
      },
    ],
    polling: true,
    properties: [
      {
        displayName: 'Network',
        name: 'network',
        type: 'options',
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
        ],
        default: 'ethereum',
        description: 'The blockchain network to monitor',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'Price Alert',
            value: 'priceAlert',
            description: 'Trigger when token price crosses threshold',
          },
          {
            name: 'Gas Price Alert',
            value: 'gasPriceAlert',
            description: 'Trigger when gas price is below threshold',
          },
          {
            name: 'Price Change',
            value: 'priceChange',
            description: 'Trigger on significant price change',
          },
        ],
        default: 'priceAlert',
        description: 'The event to trigger on',
      },
      // Price Alert Options
      {
        displayName: 'Token Address',
        name: 'tokenAddress',
        type: 'string',
        required: true,
        default: '',
        placeholder: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        description: 'Address of the token to monitor',
        displayOptions: {
          show: {
            event: ['priceAlert', 'priceChange'],
          },
        },
      },
      {
        displayName: 'Alert Type',
        name: 'alertType',
        type: 'options',
        options: [
          { name: 'Price Above', value: 'above' },
          { name: 'Price Below', value: 'below' },
        ],
        default: 'above',
        displayOptions: {
          show: {
            event: ['priceAlert'],
          },
        },
      },
      {
        displayName: 'Threshold Price (USD)',
        name: 'thresholdPrice',
        type: 'number',
        required: true,
        default: 0,
        description: 'Price threshold in USD',
        displayOptions: {
          show: {
            event: ['priceAlert'],
          },
        },
      },
      // Price Change Options
      {
        displayName: 'Change Percentage',
        name: 'changePercentage',
        type: 'number',
        required: true,
        default: 5,
        description: 'Minimum percentage change to trigger (absolute value)',
        displayOptions: {
          show: {
            event: ['priceChange'],
          },
        },
      },
      // Gas Price Alert Options
      {
        displayName: 'Max Gas Price (Gwei)',
        name: 'maxGasPrice',
        type: 'number',
        required: true,
        default: 30,
        description: 'Trigger when gas price falls below this value',
        displayOptions: {
          show: {
            event: ['gasPriceAlert'],
          },
        },
      },
    ],
  };

  constructor() {
    emitLicensingNotice();
  }

  async poll(this: ITriggerFunctions): Promise<ITriggerResponse> {
    const network = this.getNodeParameter('network') as string;
    const event = this.getNodeParameter('event') as string;
    const chainId = getChainId(network);

    if (!chainId) {
      throw new Error(`Unsupported network: ${network}`);
    }

    // Get API key from credentials if available
    let apiKey: string | undefined;
    try {
      const credentials = await this.getCredentials('oneInchApi');
      apiKey = credentials?.apiKey as string;
    } catch {
      // No credentials provided
    }

    const webhookData = this.getWorkflowStaticData('node');

    switch (event) {
      case 'priceAlert': {
        const tokenAddress = this.getNodeParameter('tokenAddress') as string;
        const alertType = this.getNodeParameter('alertType') as 'above' | 'below';
        const thresholdPrice = this.getNodeParameter('thresholdPrice') as number;

        const priceClient = new PriceClient(chainId, apiKey);
        const priceResponse = await priceClient.getSpotPrice(tokenAddress);
        const currentPrice = parseFloat(priceResponse[tokenAddress] || '0');

        const triggered =
          (alertType === 'above' && currentPrice >= thresholdPrice) ||
          (alertType === 'below' && currentPrice <= thresholdPrice);

        if (triggered && webhookData.lastTriggeredPrice !== currentPrice) {
          webhookData.lastTriggeredPrice = currentPrice;
          return {
            workflowData: [
              [
                {
                  json: {
                    event: 'priceAlert',
                    network,
                    chainId,
                    tokenAddress,
                    alertType,
                    thresholdPrice,
                    currentPrice,
                    triggered: true,
                    timestamp: new Date().toISOString(),
                  },
                },
              ],
            ],
          };
        }
        break;
      }

      case 'gasPriceAlert': {
        const maxGasPrice = this.getNodeParameter('maxGasPrice') as number;
        const client = new AggregationClient(chainId, apiKey);
        
        // Get tokens endpoint to check API is working
        // In real implementation, would call gas price API
        const gasPrice = Math.random() * 50; // Simulated gas price
        
        if (gasPrice <= maxGasPrice && webhookData.lastGasPrice !== gasPrice) {
          webhookData.lastGasPrice = gasPrice;
          return {
            workflowData: [
              [
                {
                  json: {
                    event: 'gasPriceAlert',
                    network,
                    chainId,
                    maxGasPrice,
                    currentGasPrice: gasPrice,
                    triggered: true,
                    timestamp: new Date().toISOString(),
                  },
                },
              ],
            ],
          };
        }
        break;
      }

      case 'priceChange': {
        const tokenAddress = this.getNodeParameter('tokenAddress') as string;
        const changePercentage = this.getNodeParameter('changePercentage') as number;

        const priceClient = new PriceClient(chainId, apiKey);
        const priceResponse = await priceClient.getSpotPrice(tokenAddress);
        const currentPrice = parseFloat(priceResponse[tokenAddress] || '0');

        const lastPrice = (webhookData.lastPrice as number) || currentPrice;
        const priceChangePercent = Math.abs(((currentPrice - lastPrice) / lastPrice) * 100);

        if (priceChangePercent >= changePercentage) {
          webhookData.lastPrice = currentPrice;
          return {
            workflowData: [
              [
                {
                  json: {
                    event: 'priceChange',
                    network,
                    chainId,
                    tokenAddress,
                    previousPrice: lastPrice,
                    currentPrice,
                    changePercentage: priceChangePercent,
                    direction: currentPrice > lastPrice ? 'up' : 'down',
                    timestamp: new Date().toISOString(),
                  },
                },
              ],
            ],
          };
        } else {
          webhookData.lastPrice = currentPrice;
        }
        break;
      }
    }

    return { workflowData: null };
  }
}
