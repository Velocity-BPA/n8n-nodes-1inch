/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { AggregationClient } from '../../transport/aggregationClient';
import { getChainId } from '../../constants/networks';
import { validateSwapParams, fromWei, calculateExchangeRate } from '../../utils/swapUtils';

export const description: INodeProperties[] = [
  {
    displayName: 'Source Token',
    name: 'srcToken',
    type: 'string',
    required: true,
    default: '',
    placeholder: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    description: 'Address of the token to swap from (use 0xEeee...EEeE for native token)',
    displayOptions: {
      show: {
        resource: ['swap'],
        operation: ['getQuote'],
      },
    },
  },
  {
    displayName: 'Destination Token',
    name: 'dstToken',
    type: 'string',
    required: true,
    default: '',
    placeholder: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    description: 'Address of the token to swap to',
    displayOptions: {
      show: {
        resource: ['swap'],
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
    description: 'Amount of source token to swap (in wei/smallest unit)',
    displayOptions: {
      show: {
        resource: ['swap'],
        operation: ['getQuote'],
      },
    },
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['swap'],
        operation: ['getQuote'],
      },
    },
    options: [
      {
        displayName: 'Fee Percent',
        name: 'fee',
        type: 'number',
        default: 0,
        description: 'Fee percentage (0-3)',
      },
      {
        displayName: 'Protocols',
        name: 'protocols',
        type: 'string',
        default: '',
        placeholder: 'UNISWAP_V3,CURVE',
        description: 'Comma-separated list of protocols to use',
      },
      {
        displayName: 'Gas Price',
        name: 'gasPrice',
        type: 'string',
        default: '',
        description: 'Custom gas price in wei',
      },
      {
        displayName: 'Complexity Level',
        name: 'complexityLevel',
        type: 'options',
        options: [
          { name: 'Simple (0)', value: 0 },
          { name: 'Medium (1)', value: 1 },
          { name: 'Complex (2)', value: 2 },
          { name: 'Very Complex (3)', value: 3 },
        ],
        default: 2,
        description: 'Maximum number of splits per path',
      },
      {
        displayName: 'Connector Tokens',
        name: 'connectorTokens',
        type: 'string',
        default: '',
        description: 'Comma-separated list of connector token addresses',
      },
      {
        displayName: 'Include Tokens Info',
        name: 'includeTokensInfo',
        type: 'boolean',
        default: true,
        description: 'Include token information in response',
      },
      {
        displayName: 'Include Protocols',
        name: 'includeProtocols',
        type: 'boolean',
        default: true,
        description: 'Include protocol routing information',
      },
      {
        displayName: 'Include Gas',
        name: 'includeGas',
        type: 'boolean',
        default: true,
        description: 'Include gas estimate in response',
      },
    ],
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

  const client = new AggregationClient(chainId, apiKey);

  for (let i = 0; i < items.length; i++) {
    try {
      const srcToken = this.getNodeParameter('srcToken', i) as string;
      const dstToken = this.getNodeParameter('dstToken', i) as string;
      const amount = this.getNodeParameter('amount', i) as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', i) as {
        fee?: number;
        protocols?: string;
        gasPrice?: string;
        complexityLevel?: number;
        connectorTokens?: string;
        includeTokensInfo?: boolean;
        includeProtocols?: boolean;
        includeGas?: boolean;
      };

      // Validate parameters
      const validation = validateSwapParams({
        srcToken,
        dstToken,
        amount,
        slippage: 1, // Default for quote
      });

      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const quote = await client.getQuote({
        src: srcToken,
        dst: dstToken,
        amount,
        fee: additionalOptions.fee,
        protocols: additionalOptions.protocols,
        gasPrice: additionalOptions.gasPrice,
        complexityLevel: additionalOptions.complexityLevel,
        connectorTokens: additionalOptions.connectorTokens,
        includeTokensInfo: additionalOptions.includeTokensInfo ?? true,
        includeProtocols: additionalOptions.includeProtocols ?? true,
        includeGas: additionalOptions.includeGas ?? true,
      });

      // Calculate exchange rate
      const srcDecimals = quote.srcToken?.decimals || 18;
      const dstDecimals = quote.dstToken?.decimals || 18;
      const exchangeRate = calculateExchangeRate(amount, quote.dstAmount, srcDecimals, dstDecimals);

      returnData.push({
        json: {
          chainId,
          network,
          srcToken: quote.srcToken,
          dstToken: quote.dstToken,
          srcAmount: amount,
          srcAmountFormatted: fromWei(amount, srcDecimals),
          dstAmount: quote.dstAmount,
          dstAmountFormatted: fromWei(quote.dstAmount, dstDecimals),
          exchangeRate,
          gas: quote.gas,
          protocols: quote.protocols,
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
