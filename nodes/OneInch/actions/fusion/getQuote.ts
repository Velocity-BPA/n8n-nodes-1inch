/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { FusionClient } from '../../transport/fusionClient';
import { getChainId } from '../../constants/networks';
import { fromWei } from '../../utils/swapUtils';

export const description: INodeProperties[] = [
  {
    displayName: 'Source Token',
    name: 'fromTokenAddress',
    type: 'string',
    required: true,
    default: '',
    placeholder: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    description: 'Address of the token to swap from (must be ERC20, not native)',
    displayOptions: {
      show: {
        resource: ['fusion'],
        operation: ['getQuote'],
      },
    },
  },
  {
    displayName: 'Destination Token',
    name: 'toTokenAddress',
    type: 'string',
    required: true,
    default: '',
    placeholder: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    description: 'Address of the token to receive',
    displayOptions: {
      show: {
        resource: ['fusion'],
        operation: ['getQuote'],
      },
    },
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'string',
    required: true,
    default: '',
    placeholder: '1000000000000000000',
    description: 'Amount of source token to swap (in wei)',
    displayOptions: {
      show: {
        resource: ['fusion'],
        operation: ['getQuote'],
      },
    },
  },
  {
    displayName: 'Wallet Address',
    name: 'walletAddress',
    type: 'string',
    required: true,
    default: '',
    placeholder: '0x...',
    description: 'Your wallet address',
    displayOptions: {
      show: {
        resource: ['fusion'],
        operation: ['getQuote'],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
  network: string,
  apiKey?: string
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const chainId = getChainId(network);

  if (!chainId) {
    throw new Error(`Unsupported network: ${network}`);
  }

  const client = new FusionClient(chainId, apiKey);

  for (let i = 0; i < items.length; i++) {
    try {
      const fromTokenAddress = this.getNodeParameter('fromTokenAddress', i) as string;
      const toTokenAddress = this.getNodeParameter('toTokenAddress', i) as string;
      const amount = this.getNodeParameter('amount', i) as string;
      const walletAddress = this.getNodeParameter('walletAddress', i) as string;

      const quote = await client.getQuote({
        fromTokenAddress,
        toTokenAddress,
        amount,
        walletAddress,
      });

      returnData.push({
        json: {
          chainId,
          network,
          quoteId: quote.quoteId,
          fromTokenAmount: quote.fromTokenAmount,
          fromTokenAmountFormatted: fromWei(quote.fromTokenAmount, 18),
          toTokenAmount: quote.toTokenAmount,
          toTokenAmountFormatted: fromWei(quote.toTokenAmount, 18),
          feeToken: quote.feeToken,
          estimatedGas: quote.estimatedGas,
          presets: quote.presets,
          recommendedPreset: quote.recommendedPreset,
          settlementAddress: quote.settlementAddress,
          whitelist: quote.whitelist,
        },
        pairedItem: { item: i },
      });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({
          json: {
            error: error instanceof Error ? error.message : String(error),
          },
          pairedItem: { item: i },
        });
        continue;
      }
      throw error;
    }
  }

  return returnData;
}
